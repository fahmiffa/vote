"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    if (res?.ok) {
      router.push("/dashboard")
    } else {
      toast.error("Login Gagal");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">Login</h2>
        <label htmlFor="email" className="mb-1 block font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <label htmlFor="password" className="mb-1 block font-medium text-gray-700">
          Password
        </label>
        <div className="relative flex items-center mb-3">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            type="button"
            onClick={toggleShow}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              // Icon: eye (showing password)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                <path
                  fillRule="evenodd"
                  d="M1.32 11.45C2.81 6.98 7.03 3.75 12 3.75c4.97 0 9.19 3.22 10.68 7.69.12.36.12.75 0 1.11C21.19 17.02 16.97 20.25 12 20.25c-4.97 0-9.19-3.22-10.68-7.69a1.76 1.76 0 0 1 0-1.11ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              // Icon: eye-off (hiding password)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-off"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </svg>
            )}
          </button>

        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  )
}
