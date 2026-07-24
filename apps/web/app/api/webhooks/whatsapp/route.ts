import { NextResponse } from 'next/server';
import { processChatRequest } from '@smartfood/ai';
import { sendWhatsAppMessage } from '@smartfood/whatsapp';

// Receive messages from Twilio WhatsApp Sandbox
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const fromPhone = formData.get('From') as string; // Format: "whatsapp:+1234567890"
    const text = formData.get('Body') as string;

    if (!fromPhone || !text) {
      return new NextResponse('Invalid Request', { status: 400 });
    }

    // Strip the "whatsapp:" prefix to just get the number
    const plainPhone = fromPhone.replace('whatsapp:', '');

    // Extract Student ID or create an anonymous session based on phone number
    const { prisma } = await import('@smartfood/database');
    
    // Look up the student by phone
    let student = await prisma.student.findUnique({
      where: { phone: plainPhone }
    });

    // If no student exists, create a temporary one for the conversation
    if (!student) {
      student = await prisma.student.create({
        data: {
          registrationNumber: `GUEST_${plainPhone}`,
          name: 'WhatsApp Guest',
          email: `${plainPhone}@guest.local`,
          phone: plainPhone,
          passwordHash: 'guest_no_password',
          status: 'PENDING_VERIFICATION'
        }
      });
    }

    const studentId = student.id;

    console.log(`[WhatsApp] Received from ${plainPhone}: ${text}`);

    // Pass message to the AI agent
    const aiResponse = await processChatRequest(studentId, text);

    // Use packages/whatsapp to send the aiResponse back to fromPhone
    await sendWhatsAppMessage({
      to: plainPhone,
      type: 'text',
      text: aiResponse
    });
    console.log(`[WhatsApp] Replying to ${plainPhone}: ${aiResponse}`);

    // Twilio expects a 200 OK or TwiML response. 
    // We send an empty TwiML or just OK since we replied asynchronously using the client.
    return new NextResponse('<Response></Response>', { 
      status: 200, 
      headers: { 'Content-Type': 'text/xml' } 
    });
  } catch (error) {
    console.error('[WhatsApp Webhook Error]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
