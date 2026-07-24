import twilio from 'twilio';

export interface SendMessageOptions {
  to: string;
  type: 'text' | 'interactive';
  text?: string;
  interactive?: any; // To be typed properly later for Buttons/Lists
}

let twilioClient: twilio.Twilio | null = null;
function getClient() {
  if (!twilioClient) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (sid && token) {
      twilioClient = twilio(sid, token);
    }
  }
  return twilioClient;
}

export async function sendWhatsAppMessage({ to, type, text, interactive }: SendMessageOptions) {
  const client = getClient();
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!client || !fromNumber) {
    console.warn('[WhatsApp] Missing Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) or TWILIO_WHATSAPP_NUMBER');
    return;
  }

  // Ensure 'whatsapp:' prefix
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  
  try {
    const bodyText = type === 'text' ? text : "Interactive messages require Twilio Content Templates";
    
    const response = await client.messages.create({
      body: bodyText,
      from: fromNumber,
      to: formattedTo,
    });

    return response;
  } catch (error) {
    console.error('[WhatsApp] Twilio Send Message Error:', error);
    throw error;
  }
}
