import withAuth from "@/lib/withAuth"
import Navbar from "./Navbar";

export default withAuth(async (session) => {

  return (
    <>
      <Navbar da={session}/>
      <main className="flex flex-col items-center justify-center p-8 bg-gray-50 shadow-md rounded-2xl text-black my-10 mx-20">
        <h1 className="text-3xl font-bold mb-4">WELCOME TO VOTE</h1>
        <p className="mb-8">{session.user?.name}</p>
      </main>
    </>
  );
})
