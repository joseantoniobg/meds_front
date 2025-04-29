import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { Axios, AxiosError } from 'axios';

export async function POST(req: Request) {
  const body = await req.json();

  console.log('body', body);

  try {
    const res = await api.post('/auth/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return NextResponse.json(res.data);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      console.log('error', error.response?.data);
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}