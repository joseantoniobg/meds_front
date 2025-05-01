import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { getSession } from '@/lib/session';
import { SysUser } from '@/lib/utils';

export async function GET(req: Request) {
  const parameters = req.url.split('?')[1];

  const session = await getSession();
  const sessionUser = (session as unknown as { user: SysUser }).user;

  try {
    const res = await api.request({
      method: 'GET',
      url: `/patients?${parameters}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const patients = res.data;

    return NextResponse.json(patients);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = (session as unknown as { user: SysUser }).user;

  try {
    const res = await api.request({
      method: 'POST',
      url: `/patients`,
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

export async function PATCH(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = (session as unknown as { user: SysUser }).user;

  try {
    const res = await api.request({
      method: 'PATCH',
      url: `/patients/${data.id}`,
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