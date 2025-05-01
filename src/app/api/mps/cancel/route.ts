import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { getSession } from '@/lib/session';

export async function PATCH(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = session.user;

  try {
    const res = await api.request({
      method: 'PATCH',
      url: `/medicalPrescriptions/cancel`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const saved = res.data;

    return NextResponse.json(saved);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}