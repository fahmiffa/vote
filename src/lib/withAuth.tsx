import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { Session } from "next-auth"

type AuthenticatedPage = (session: Session) => Promise<ReactNode>

export default function withAuth(page: AuthenticatedPage) {
  return async function AuthenticatedWrapper() {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      redirect("/login")
    }

    return page(session)
  }
}
