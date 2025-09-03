'use client'; 

import { useState } from 'react';
import Link from 'next/link';

import { signOut } from "next-auth/react";

export default function Navbar(da : any) {
  const role = Number(da.da.user.role);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-gray-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-bold text-black">
              Home
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {role == 0 && 
              <>
                <Link href="/vote" className="text-gray-700 font-semibold hover:text-black">
                  Vote
                </Link>
                <Link href="/calon" className="text-gray-700 font-semibold hover:text-black">
                  Calon
                </Link>
                <Link href="/pemilih" className="text-gray-700 font-semibold hover:text-black">
                  Pemilih
                </Link>
                <Link href="/user" className="text-gray-700 font-semibold hover:text-black">
                  User
                </Link>
              </>
             }

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-700 font-semibold hover:text-black cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-700 font-semibold hover:text-black cursor-pointer"
            >
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
                className="lucide lucide-log-out-icon lucide-log-out"
              >
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-700 font-semibold hover:text-black focus:outline-none"
            >
              {/* Icon: Hamburger or X */}
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>


          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-700 font-semibold hover:text-black">
            Home
          </Link>
          <Link href="/about" className="block text-gray-700 font-semibold hover:text-black">
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
