import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function Dashboard() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users
  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <h1>Ola Utilizador, cria o teu sorteio!</h1>
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h1>Dashboard</h1>
        <p>Welcome, {session.user?.name}!</p>
        <p>Email: {session.user?.email}</p>
        <p>User ID: {session.user?.id}</p>
      </div>
    </div>
  );
}
