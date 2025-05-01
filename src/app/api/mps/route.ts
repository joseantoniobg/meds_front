import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { getSession } from '@/lib/session';
import { SysUser } from '@/lib/utils';

export async function POST(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = (session as unknown as { user: SysUser }).user;

  try {
    const res = await api.request({
      method: 'POST',
      url: `/medicalPrescriptions`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const meds = res.data;

    return NextResponse.json(meds);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}