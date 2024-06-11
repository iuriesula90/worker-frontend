import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('Authorizing user with credentials:', credentials);
                const user = { id: 1, name: "User", email: "user@example.com" };
                console.log('User authorized:', user);
                return user || null;
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log('JWT callback:', { token, user });
            if (user) {
                token.role = user.role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            console.log('Session callback:', { session, token });
            session.user.role = token.role;
            return session;
        }
    }
};

export default async function authHandler(req, res) {
    console.log('Handling auth request:', req.method, req.url);
    try {
        await NextAuth(req, res, authOptions);
        console.log('Auth handled successfully');
    } catch (error) {
        console.error('Error handling auth:', error);
        res.status(500).end('Internal Server Error');
    }
}
