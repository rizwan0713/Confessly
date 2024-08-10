import { NextRequest, NextResponse } from 'next/server'
 export { default } from "next-auth/middleware"
 import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request})
    console.log("printing token in middleware",token);
    const url = request.nextUrl
    // console.log("printing url of next url  provided by request.nexturl",url);
    // printing url of next url  provided by request.nexturl {
    //   href: 'http://localhost:3000/',
    //   origin: 'http://localhost:3000',
    //   protocol: 'http:',
    //   username: '',
    //   password: '',
    //   host: 'localhost:3000',
    //   hostname: 'localhost',
    //   port: '3000',
    //   pathname: '/',
    //   search: '',
    //   searchParams: URLSearchParams {  },
    //   hash: ''
    // }
    if (token && (
      
                      url.pathname.startsWith('/sign-in') ||
                      url.pathname.startsWith('/sign-up') ||
                      url.pathname.startsWith('/verify/:path*') 
                    
                      // url.pathname.startsWith('/')
                      // url.pathname === '/'
                   )
    ) {  
                                                                            // console.log("request.url is:",request.url)
           return NextResponse.redirect(new URL('/dashboard',request.url)); // request.url is : http://localhost:3000/
        
    }
    if(!token && url.pathname.startsWith('/dashboard')){
      return NextResponse.redirect(new URL('/sign-in',request.url));
    }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:[ 
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
]
}