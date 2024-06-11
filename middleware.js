import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    console.log('Middleware handling request:', req.url);
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const url = req.nextUrl.clone();
        const baseUrl = url.origin;

        console.log('Token:', token);

        if (!token) {
            console.log('No token found, redirecting to sign-in');
            if (url.pathname !== '/api/auth/signin') {
                return NextResponse.redirect(`${baseUrl}/api/auth/signin`);
            }
            return NextResponse.next();
        }

        const userRole = token.role;
        console.log('User role:', userRole);

        if (url.pathname.startsWith("/admin") && userRole !== "admin") {
            console.log('Unauthorized access to admin page, redirecting');
            return NextResponse.redirect(`${baseUrl}/not-authorized`);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error in middleware:', error);
        return NextResponse.next();
    }
}
