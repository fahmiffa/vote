import withAuth from "@/lib/withAuth"
import Navbar from "@/app/dashboard/Navbar";
import Data from "./Data";


export default withAuth(async (session) => {

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-green-500 to-blue-500">
            <Navbar da={session} />
            <main className="flex flex-col items-start p-8 bg-gray-50 shadow-md rounded-2xl text-black my-10 mx-8 md:mx-20">
                <Data />
            </main>
        </div>
    );
})
