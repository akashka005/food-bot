import { NextResponse } from 'next/server';
import { prisma } from '@smartfood/database';
import { hashPassword } from '@smartfood/auth';
import { studentRegisterSchema } from '@smartfood/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, phone, password, registrationNumber } = parsed.data;

    // Check if email already exists
    const existingEmail = await prisma.student.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    if (phone) {
      const existingPhone = await prisma.student.findUnique({ where: { phone } });
      if (existingPhone) {
        return NextResponse.json({ error: 'An account with this phone number already exists.' }, { status: 409 });
      }
    }

    const existingReg = await prisma.student.findUnique({ where: { registrationNumber } });
    if (existingReg) {
      return NextResponse.json({ error: 'An account with this registration number already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.student.create({
      data: {
        name,
        email,
        phone,
        registrationNumber,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[Register API Error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
