import { Request, Response } from 'express';
import { query } from '../config/db';
import { CreateTicketDto, CreateTicketAssignmentDto, TicketResponse } from '../models/Ticket';

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  console.log('createTicket called');
  try {
    // Declare ticket_id variable to use across scopes
    let ticket_id: number | null = null;
    
    // Coerce IDs to numbers and trim strings
    const is_anonymous = req.body.is_anonymous === 'true';
    const user_id = is_anonymous ? null : Number(req.body.user_id);
    const subject = (req.body.subject || '').trim();
    const description = (req.body.description || '').trim();
    const category_id = Number(req.body.category_id);
    const location = (req.body.location || '').trim();
    let agency_id = Number(req.body.agency_id) || 0;  // Allow 0 for auto-assignment
    const photo_url = req.body.photo_url || null;

    // Log received values for debugging
    console.log('Received:', { is_anonymous, user_id, subject, description, category_id, location, agency_id, photo_url });

    // Validate required fields (except agency_id, which can be determined automatically)
    if (!subject || !description || !category_id || !location) {
      res.status(400).json({ message: 'Required fields: subject, description, category_id, location' });
      return;
    }

    // Check if category exists
    const categories = await query('SELECT * FROM categories WHERE category_id = ?', [category_id]);
    if (categories.length === 0) {
      res.status(400).json({ message: 'Category not found' });
      return;
    }

    // Check if user exists (only for non-anonymous submissions)
    if (!is_anonymous) {
      const users = await query('SELECT * FROM users WHERE user_id = ?', [user_id]);
      if (users.length === 0) {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    }

    // If agency_id is not provided or is 0, try to determine it from category mappings
    if (!agency_id) {
      const mappings = await query(
        'SELECT * FROM agencycategorymap WHERE category_id = ? LIMIT 1',
        [category_id]
      );

      if (mappings.length > 0) {
        agency_id = mappings[0].agency_id;
        console.log(`Auto-assigned agency_id ${agency_id} based on category_id ${category_id}`);
      } else {
        // If no mapping is found, we need to check if the agency_id was explicitly required
        if (req.body.agency_id === undefined) {
          // Try to find any agency to assign to
          const agencies = await query('SELECT agency_id FROM agencies LIMIT 1');
          if (agencies.length > 0) {
            agency_id = agencies[0].agency_id;
            console.log(`Fallback to first available agency_id ${agency_id}`);
          } else {
            res.status(400).json({ message: 'No agency found for this category. Please contact an administrator.' });
            return;
          }
        } else {
          res.status(400).json({ message: 'No agency is mapped to handle this category. Please select a different category or contact an administrator.' });
          return;
        }
      }
    } else {
      // If agency_id was provided, verify it exists
      const agencies = await query('SELECT * FROM agencies WHERE agency_id = ?', [agency_id]);
      if (agencies.length === 0) {
        res.status(400).json({ message: 'Agency not found' });
        return;
      }
    }

    try {
      // Try to insert with is_anonymous column
      const result = await query(
        'INSERT INTO tickets (user_id, subject, description, category_id, location, photo_url, status, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, subject, description, category_id, location, photo_url, 'Pending', is_anonymous]
      );

      if (result.insertId) {
        // Save ticket_id for later use
        ticket_id = result.insertId;
        
        // Fetch the newly created ticket
        const tickets = await query('SELECT * FROM tickets WHERE ticket_id = ?', [ticket_id]);
        
        res.status(201).json({
          message: 'Ticket created successfully',
          ticket: tickets[0]
        });
      } else {
        res.status(400).json({ message: 'Failed to create ticket' });
      }
    } catch (error: any) {
      // If the error is about missing is_anonymous column, try without it
      if (error.message.includes('is_anonymous')) {
        const result = await query(
          'INSERT INTO tickets (user_id, subject, description, category_id, location, photo_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user_id, subject, description, category_id, location, photo_url, 'Pending']
        );

        if (result.insertId) {
          // Save ticket_id for later use
          ticket_id = result.insertId;
          
          // Fetch the newly created ticket
          const tickets = await query('SELECT * FROM tickets WHERE ticket_id = ?', [ticket_id]);
          
          res.status(201).json({
            message: 'Ticket created successfully',
            ticket: tickets[0]
          });
        } else {
          res.status(400).json({ message: 'Failed to create ticket' });
        }
      } else {
        throw error;
      }
    }

    // Create ticket assignment to agency
    if (agency_id && ticket_id) {
      try {
        // Find an admin from this agency to assign the ticket to
        const agencyAdmins = await query(
          'SELECT * FROM admins WHERE agency_id = ? LIMIT 1',
          [agency_id]
        );
        
        if (agencyAdmins.length > 0) {
          // Assign to the first admin found in this agency
          const admin_id = agencyAdmins[0].admin_id;
          console.log(`Assigning ticket to admin_id ${admin_id} from agency_id ${agency_id}`);
          
          await query(
            'INSERT INTO ticketassignments (ticket_id, admin_id) VALUES (?, ?)',
            [ticket_id, admin_id]
          );
          
          // Also store the agency assignment in app state (no table for this yet)
          console.log(`Ticket ${ticket_id} assigned to agency ${agency_id}`);
        } else {
          console.log(`No admin found for agency_id ${agency_id}, ticket will remain unassigned`);
        }
      } catch (assignmentError) {
        console.error('Error assigning ticket to admin:', assignmentError);
        // Continue even if assignment fails - the ticket is still created
      }
    }
  } catch (error: any) {
    console.error('createTicket error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Assign a ticket to an admin
// @route   POST /api/tickets/:ticketId/assign
// @access  Private (Admin only)
export const assignTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = parseInt(req.params.ticketId);
    const { admin_id }: CreateTicketAssignmentDto = req.body;

    if (!admin_id) {
      res.status(400).json({ message: 'Admin ID is required' });
      return;
    }

    // Check if ticket exists
    const tickets = await query('SELECT * FROM tickets WHERE ticket_id = ?', [ticketId]);
    if (tickets.length === 0) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if admin exists
    const admins = await query('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);
    if (admins.length === 0) {
      res.status(400).json({ message: 'Admin not found' });
      return;
    }

    // Create ticket assignment
    const result = await query(
      'INSERT INTO ticketassignments (ticket_id, admin_id) VALUES (?, ?)',
      [ticketId, admin_id]
    );

    if (result.insertId) {
      // Update ticket status to Assigned
      await query(
        'UPDATE tickets SET status = ? WHERE ticket_id = ?',
        ['Assigned', ticketId]
      );

      // Fetch the assignment details
      const assignments = await query(
        'SELECT * FROM ticketassignments WHERE assignment_id = ?',
        [result.insertId]
      );

      res.status(201).json({
        message: 'Ticket assigned successfully',
        assignment: assignments[0]
      });
    } else {
      res.status(400).json({ message: 'Failed to assign ticket' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get ticket by ID with assignments
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = parseInt(req.params.id);

    // Get ticket details
    const tickets = await query('SELECT * FROM tickets WHERE ticket_id = ?', [ticketId]);
    
    if (tickets.length === 0) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Get ticket assignments
    const assignments = await query(
      'SELECT * FROM ticketassignments WHERE ticket_id = ?',
      [ticketId]
    );

    const ticketResponse: TicketResponse = {
      ...tickets[0],
      assignments: assignments
    };

    res.status(200).json(ticketResponse);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/user
// @access  Private
export const getUserTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get user's tickets with category names
    const tickets = await query(`
      SELECT t.*, c.name as category_name 
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, [user_id]);

    res.status(200).json({
      message: 'Tickets retrieved successfully',
      tickets
    });
  } catch (error: any) {
    console.error('getUserTickets error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
}; 