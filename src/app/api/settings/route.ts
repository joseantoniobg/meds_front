import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  const sessionUser = session.user;

  try {
    const res = await api.request({
      method: 'GET',
      url: `/settings`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = session.user;

  try {
    const res = await api.request({
      method: 'PATCH',
      url: `/settings`,
      data: {
        restrictReadOnlyPrint: data.restrictReadOnlyPrint,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}
