import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Par défaut admin/admin pour le test. A surcharger en prod avec une env var.
      const validUser = process.env.ADMIN_USERNAME || 'admin';
      const validPwd = process.env.ADMIN_PASSWORD || 'admin';

      if (user === validUser && pwd === validPwd) {
        return NextResponse.next();
      }
    }
    url.pathname = '/api/auth';

    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
