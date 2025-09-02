import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { Session } from "next-auth"

type AuthenticatedPage = (session: Session) => Promise<ReactNode>

export default function withSu(page: AuthenticatedPage) {
    return async function AuthenticatedWrapper() {
        const session = await getServerSession(authOptions)

        if (!session) {
            redirect("/login")
        }

        const role = session?.user.role;

        if (Number(role) != 0) {
            redirect("/dashboard")
        }

        return page(session)
    }
}
