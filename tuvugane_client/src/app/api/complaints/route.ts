import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For form data with files, we need to use formData
    const formData = await request.formData();
    
    // Extract complaint data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const userId = formData.get('user_id') as string;
    const isAnonymous = formData.get('is_anonymous') === 'true';
    const agencyId = formData.get('agency_id') as string;
    
    // Get file attachments if any
    const attachments = formData.getAll('attachments') as File[];
    let photoUrl = null;
    
    if (attachments && attachments.length > 0) {
      photoUrl = '/uploaded-image.jpg'; // Mock URL
    }
    
    // Validate required fields
    if (!title || !description || !category || !location || !agencyId) {
      return NextResponse.json(
        { error: 'Title, description, category, location, and agency are required' },
        { status: 400 }
      );
    }
    
    const ticketId = Math.floor(100000 + Math.random() * 900000);
    const complaintId = `COMP-${ticketId}`;
    
    const ticket = {
      ticket_id: ticketId,
      user_id: userId ? parseInt(userId) : null,
      agency_id: parseInt(agencyId),
      subject: title,
      description,
      category_id: 0, 
      location,
      photo_url: photoUrl,
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Return the created ticket with a complaint ID for tracking
    return NextResponse.json({ 
      message: 'Complaint submitted successfully',
      complaintId,
      ticket
    }, { status: 201 });
    
  } catch (error) {
    console.error('Complaint submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit complaint' },
      { status: 500 }
    );
  }
}