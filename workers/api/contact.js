// Workers-compatible contact API handler
import { createClient } from '@supabase/supabase-js';

export async function handleContact(request, env) {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({
        error: 'All fields are required: name, email, subject, message'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Initialize Supabase client
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Get client IP
    const ipAddress = request.headers.get('cf-connecting-ip') || 
                     request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Insert contact submission
    const { data: submission, error } = await supabase
      .from(env.CONTACT_TABLE_NAME || 'contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact submission:', error);
      
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || 
          error.message.includes('relation "contact_submissions" does not exist')) {
        return new Response(JSON.stringify({ 
          error: 'Contact system not set up yet',
          details: 'The contact database table needs to be created.',
          setup_required: true
        }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Failed to submit contact form',
        details: error.message
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Send email notification (optional - requires email service)
    try {
      await sendEmailNotification(submission, env);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }
    
    return new Response(JSON.stringify({ 
      message: 'Thank you for your message! We will get back to you soon.',
      submission: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        created_at: submission.created_at
      }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    console.error('Error in contact API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Email notification function (simplified for Workers)
async function sendEmailNotification(submission, env) {
  // This is a simplified email notification
  // In a real implementation, you'd use a service like SendGrid, Mailgun, or Resend
  console.log('Email notification:', {
    to: env.EMAIL_TO,
    subject: `New Contact Form Submission: ${submission.subject}`,
    from: submission.email,
    name: submission.name,
    message: submission.message
  });
  
  // For now, just log the notification
  // You can implement actual email sending using Cloudflare Email Workers or external service
}
