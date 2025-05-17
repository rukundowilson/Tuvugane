import { Request, Response } from 'express';
import { query } from '../config/db';
import { CreateTicketDto, CreateTicketAssignmentDto, TicketResponse } from '../models/Ticket';

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  console.log('createTicket called');
  try {
    // Coerce IDs to numbers and trim strings
    const is_anonymous = req.body.is_anonymous === 'true';
    const user_id = is_anonymous ? null : Number(req.body.user_id);
    const subject = (req.body.subject || '').trim();
    const description = (req.body.description || '').trim();
    const category_id = Number(req.body.category_id);
    const location = (req.body.location || '').trim();
    const agency_id = Number(req.body.agency_id);
    const photo_url = req.body.photo_url || null;

    // Log received values for debugging
    console.log('Received:', { is_anonymous, user_id, subject, description, category_id, location, agency_id, photo_url });

    // Validate required fields (treat 0 or NaN or empty string as missing)
    if (!subject || !description || !category_id || !location || !agency_id) {
      res.status(400).json({ message: 'All fields are required: subject, description, category_id, location, agency_id' });
      return;
    }

    // Check if category exists
    const categories = await query('SELECT * FROM Categories WHERE category_id = ?', [category_id]);
    if (categories.length === 0) {
      res.status(400).json({ message: 'Category not found' });
      return;
    }

    // Check if user exists (only for non-anonymous submissions)
    if (!is_anonymous) {
      const users = await query('SELECT * FROM Users WHERE user_id = ?', [user_id]);
      if (users.length === 0) {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    }

    try {
      // Try to insert with is_anonymous column
      const result = await query(
        'INSERT INTO Tickets (user_id, subject, description, category_id, location, photo_url, status, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, subject, description, category_id, location, photo_url, 'Pending', is_anonymous]
      );

      if (result.insertId) {
        // Fetch the newly created ticket
        const tickets = await query('SELECT * FROM Tickets WHERE ticket_id = ?', [result.insertId]);
        
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
          'INSERT INTO Tickets (user_id, subject, description, category_id, location, photo_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user_id, subject, description, category_id, location, photo_url, 'Pending']
        );

        if (result.insertId) {
          // Fetch the newly created ticket
          const tickets = await query('SELECT * FROM Tickets WHERE ticket_id = ?', [result.insertId]);
          
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
    const tickets = await query('SELECT * FROM Tickets WHERE ticket_id = ?', [ticketId]);
    if (tickets.length === 0) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if admin exists
    const admins = await query('SELECT * FROM Admins WHERE admin_id = ?', [admin_id]);
    if (admins.length === 0) {
      res.status(400).json({ message: 'Admin not found' });
      return;
    }

    // Create ticket assignment
    const result = await query(
      'INSERT INTO TicketAssignments (ticket_id, admin_id) VALUES (?, ?)',
      [ticketId, admin_id]
    );

    if (result.insertId) {
      // Update ticket status to Assigned
      await query(
        'UPDATE Tickets SET status = ? WHERE ticket_id = ?',
        ['Assigned', ticketId]
      );

      // Fetch the assignment details
      const assignments = await query(
        'SELECT * FROM TicketAssignments WHERE assignment_id = ?',
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
    const tickets = await query('SELECT * FROM Tickets WHERE ticket_id = ?', [ticketId]);
    
    if (tickets.length === 0) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Get ticket assignments
    const assignments = await query(
      'SELECT * FROM TicketAssignments WHERE ticket_id = ?',
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