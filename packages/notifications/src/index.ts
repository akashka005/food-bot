import { prisma } from '@smartfood/database';
import type { NotificationType, NotificationChannel } from '@smartfood/database';

interface SendNotificationOptions {
  userId: string;
  userType: 'STUDENT' | 'VENDOR' | 'ADMIN';
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  relatedOrderId?: string;
}

export async function sendNotification({
  userId,
  userType,
  type,
  channel,
  title,
  message,
  data,
}: SendNotificationOptions) {
  await prisma.notification.create({
    data: {
      ...(userType === 'STUDENT' ? { studentId: userId } : {}),
      ...(userType === 'VENDOR' ? { vendorId: userId } : {}),
      ...(userType === 'ADMIN' ? { adminId: userId } : {}),
      type,
      channel,
      title,
      body: message,
      data: data ? JSON.stringify(data) : undefined,
    },
  });
}

export async function sendOrderStatusNotification(
  studentId: string,
  orderId: string,
  status: string
) {
  const statusMessages: Record<string, { title: string; message: string; type: NotificationType }> = {
    ACCEPTED: {
      title: '✅ Order Confirmed!',
      message: 'Your order has been received and is being prepared.',
      type: 'ORDER_ACCEPTED'
    },
    PREPARING: {
      title: '👨‍🍳 Order Being Prepared',
      message: 'The vendor is cooking your meal. It will be ready soon!',
      type: 'ORDER_PREPARING'
    },
    READY: {
      title: '🔔 Order Ready for Pickup!',
      message: 'Your order is ready! Head to the stall to pick it up.',
      type: 'ORDER_READY'
    },
    COMPLETED: {
      title: '🎉 Order Completed',
      message: 'Enjoy your meal! Don\'t forget to rate your experience.',
      type: 'ORDER_COMPLETED'
    },
    CANCELLED: {
      title: '❌ Order Cancelled',
      message: 'Your order was cancelled. A refund will be processed if applicable.',
      type: 'ORDER_CANCELLED'
    },
  };

  const msg = statusMessages[status];
  if (!msg) return;

  await sendNotification({
    userId: studentId,
    userType: 'STUDENT',
    type: msg.type,
    channel: 'IN_APP',
    title: msg.title,
    message: msg.message,
    data: { relatedOrderId: orderId },
  });
}

export async function getUnreadNotifications(userId: string, userType: 'STUDENT' | 'VENDOR' | 'ADMIN') {
  return prisma.notification.findMany({
    where: {
      ...(userType === 'STUDENT' ? { studentId: userId } : {}),
      ...(userType === 'VENDOR' ? { vendorId: userId } : {}),
      ...(userType === 'ADMIN' ? { adminId: userId } : {}),
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
