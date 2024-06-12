import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
    points: 8,
    duration: 5,
  });
  
  export async function middleware(request: NextRequest) {
    try {
      await rateLimiter.consume(request.ip);

      return NextResponse.next();
    } catch (rateLimiterRes) {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }

  export const config = {
    matcher: '/api/:path*',
  };  
