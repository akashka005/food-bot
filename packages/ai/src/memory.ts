import { prisma } from '@smartfood/database';
import type { MessageRole, MessageType } from '@smartfood/database';

export async function getConversationHistory(studentId: string, limit: number = 20) {
  // Find active conversation or create one
  let conversation = await prisma.conversation.findFirst({
    where: { 
      studentId,
      status: 'ACTIVE'
    },
    orderBy: { updatedAt: 'desc' }
  });

  if (!conversation) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    conversation = await prisma.conversation.create({
      data: {
        studentId,
        whatsappPhone: student?.phone || '',
        status: 'ACTIVE'
      }
    });
    return { conversationId: conversation.id, messages: [] };
  }

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });

  return { conversationId: conversation.id, messages };
}

export async function addMessageToHistory(
  conversationId: string, 
  role: MessageRole, 
  content: string, 
  type: MessageType = 'TEXT'
) {
  return prisma.chatMessage.create({
    data: {
      conversationId,
      role,
      content,
      type
    }
  });
}
