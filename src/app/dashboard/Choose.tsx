'use client';

import { useState, useEffect, useRef } from "react";
import { Pemilih } from "@/lib/type";
import toast, { Toaster } from "react-hot-toast";
import { X, Check } from 'lucide-react';

export default function Choose() {

    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    const ws = useRef<WebSocket | null>(null);

    const [messages, setMessages] = useState<string[]>([]);
    const [id, setId] = useState('');

    const connectWebSocket = (url: string) => {
        if (ws.current) {
            console.log('WebSocket already connected');
            return;
        }

        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 0) {
                console.log('Dapat ID dari server:', data.id);
                setId(data.id);
            }
            else {
                setMessages((prev) => [...prev, event.data]);
            }
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
            ws.current = null; // reset supaya bisa connect ulang
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    useEffect(() => {
        fetchData();
        device();
        if (url) {
            connectWebSocket(url);
        } else {
            console.error('SOCKET_URL is not defined');
        }

        // return () => {
        //     if (ws.current) {
        //         ws.current.close();
        //     }
        // };
    }, []);

    const sendMessage = (da: number) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            var as = { type: 1, device: da }
            ws.current.send(JSON.stringify(as));
        }
    };

    async function device() {
        try {
            const stts = await fetch("/api/device");
            const button = await stts.json();
            SetMan(button.item[0].man);
            SetMen(button.item[0].men);
        } catch {
            console.error("Failed to fetch device data");
        }
    }

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;
    const [man, SetMan] = useState(0);
    const [men, SetMen] = useState(0);

    async function fetchData() {
        try {
            const res = await fetch("/api/pemilih");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            } else {
                toast.error("Gagal mengambil data user");
            }
        } catch (error) {
            toast.error(`Terjadi kesalahan saat fetch data ${error}`);
        }
    }

    const [users, setUsers] = useState<Pemilih[]>([]);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleUp(user: Pemilih) {
        await fetch(`/api/pemilih/${user.id}`, {
            method: "PUT",  // 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: 1 }),
        });

        fetchData();
    }

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full">
            <div className="text-xs my-3 items-start">{id}</div>
                <Toaster position="top-right" />
                {/* Search */}
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="p-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <div className="flex items-center gap-2">


                        <button
                            onClick={() => sendMessage(11)}
                            className={`rounded-2xl text-white py-1 px-3 cursor-pointer bg-blue-500 hover:bg-blue-800`}
                        >
                            Putra
                        </button>
                        <button
                            onClick={() => sendMessage(22)}
                            className={`rounded-2xl text-white py-1 px-3 cursor-pointer bg-orange-500 hover:bg-orange-800`}
                        >
                            Putri
                        </button>
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="py-2 px-4 border-b text-left">No</th>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Kelas</th>
                                <th className="py-2 px-4 border-b text-center">Memilih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b border-gray-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">{user.kelas}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <div className="flex items-center justify-center">
                                            {user.status == 0 &&
                                                <button className="p-1 bg-red-500 rounded text-white" onClick={() => handleUp(user)}
                                                >
                                                    <X />
                                                </button>
                                            }
                                            {user.status == 1 &&
                                                <button className="p-1 bg-green-500 rounded text-white"
                                                >
                                                    <Check />
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-gray-500">
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > itemsPerPage && (
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </>
    );
}
