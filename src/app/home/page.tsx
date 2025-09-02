import withAuth from "@/lib/withAuth"

export default withAuth(async (session) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.email}</h1>
      <p className="mb-8">Ini halaman Home</p>
    </main>
  );
})
