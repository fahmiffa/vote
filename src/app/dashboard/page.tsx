import withAuth from "@/lib/withAuth"
import Navbar from "./Navbar";
import Device from "./Device";
import Choose from "./Choose";

export default withAuth(async (session) => {

  const role = Number(session.user.role)
  return (
    <>
      {role == 2 || role == 0 ? (
        <>
          <Navbar da={session} />
          <main className="flex flex-col items-center justify-center p-8 bg-gray-50 shadow-md rounded-2xl text-black my-10 mx-20">
            <Choose/>
          </main>
        </>
      ) : (
        <Device da={session} />
      )}

    </>
  );
})
