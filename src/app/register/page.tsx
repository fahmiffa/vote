"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role :  0}),
    })
    if (res.ok) {
      router.push("/login")
    } else {
      alert("Error register")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">Register</h2>
        <label htmlFor="nama" className="mb-1 block font-medium text-gray-700">
          Nama
        </label>
        <input
          id="nama"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <label htmlFor="email" className="mb-1 block font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <label htmlFor="password" className="mb-1 block font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          className="mb-6 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-purple-600 py-2 text-white transition hover:bg-purple-700"
        >
          Register
        </button>
      </form>
    </div>
  )
}
