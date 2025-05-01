import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { jwtDecode } from "jwt-decode";
import { getSession } from '@/lib/session';
import { SysUser } from '@/lib/utils';

export async function POST(req: Request) {
  const body = await req.json();

  type TokenPayload = { id: string, name: string, login: string };

  try {
    const res = await api.request({
      method: 'POST',
      url: '/auth/token',
      data: new URLSearchParams({
        client_id: body.client_id,
        client_secret: body.client_secret,
        grant_type: 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const decoded = jwtDecode<TokenPayload>(res.data.access_token);

    const session = await getSession();
    (session as unknown as { user: SysUser }).user = {
      id: decoded.id,
      name: decoded.name,
      login: decoded.login,
      token: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
    await session.save();

    return NextResponse.json(decoded);
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data, { status: error.status });
    }
    return NextResponse.json({ message: 'Erro desconhecido' }, { status: 500 });
  }
}