import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { getSession } from '@/lib/session';

export async function GET(req: Request) {
  const parameters = req.url.split('?')[1];

  const session = await getSession();
  const sessionUser = session.user;

  try {
    const res = await api.request({
      method: 'GET',
      url: `/medicalPrescriptions/print?${parameters}&page=1&size=10000`,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const html = res.data;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}