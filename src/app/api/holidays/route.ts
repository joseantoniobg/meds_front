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
      url: `/holidays?${parameters}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const holidays = res.data;

    return NextResponse.json(holidays);
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
  const sessionUser = session.user;

  try {
    const res = await api.request({
      method: 'POST',
      url: `/holidays`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const holiday = res.data;

    return NextResponse.json(holiday);
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
      url: `/holidays/${data.date}`,
      data: {
        date: data.date,
        description: data.description,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    const holiday = res.data;

    return NextResponse.json(holiday);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const data = await req.json();

  const session = await getSession();
  const sessionUser = session.user;

  try {
    await api.request({
      method: 'DELETE',
      url: `/holidays/${data.date}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionUser.token}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}
