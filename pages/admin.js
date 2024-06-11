import { useSession } from "next-auth/react";

export default function Admin() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>Access Denied</p>;

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, {session.user.name}</p>
        </div>
    );
}
