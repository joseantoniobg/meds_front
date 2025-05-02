import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { recaptcha } = body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;

  const response = await fetch(verificationUrl, {
    method: 'POST',
  });
  const data = await response.json();

  if (data.success) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ ok: false }, { status: 200 });
}