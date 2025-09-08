'use client';

import { useState, useEffect, useRef } from "react";
import { Head } from "@/lib/type";
import toast, { Toaster } from "react-hot-toast";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Device(da: any) {

    const role = Number(da.da.user.role);

    const [users, setUsers] = useState<Head[]>([]);

    const [first, SetFirst] = useState(0);
    const [second, SetSecond] = useState(0);
    async function fetchData() {
        try {
            const res = await fetch("/api/vote");
            const stts = await fetch("/api/device");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            } else {
                toast.error("Gagal mengambil data user");
            }
        } catch {
            toast.error("Terjadi kesalahan saat fetch data");
        }
    }

    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    const ws = useRef<WebSocket | null>(null);

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
                setId(data.id)
            }
            else if (data.type === "broadcast") {
                const msg = parseMessage(data.message);

                if (msg.type === 1 && role == msg.device) {

                    if (first == 0) {
                        SetFirst(1);
                    }

                    if (second == 0) {
                        SetSecond(1);
                    }
                }

            }
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
            ws.current = null;
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    useEffect(() => {
        fetchData();

        if (url) {
            connectWebSocket(url);
        } else {
            console.error('SOCKET_URL is not defined');
        }
    }, []);

    function parseMessage(message: any) {
        // Jika message adalah objek Buffer
        if (message && message.type === 'Buffer' && Array.isArray(message.data)) {
            // Node.js
            const buf = Buffer.from(message.data);
            try {
                const parsed = JSON.parse(buf.toString());
                return parsed;
            } catch (err) {
                console.error("Gagal parse buffer:", err);
                return null;
            }
        }

        // Jika message sudah dalam bentuk objek JSON
        if (typeof message === 'object' && !Array.isArray(message)) {
            return message;
        }

        // Jika message adalah string JSON
        if (typeof message === 'string') {
            try {
                return JSON.parse(message);
            } catch (err) {
                console.error("Gagal parse string JSON:", err);
                return null;
            }
        }

        // Format tidak dikenali
        return null;
    }

    let val: typeof users = [];

    if (role == 11) {
        val = users.filter((item) => item.name == "OSIS" || item.name == "IPNU");
    }
    else if (role == 22) {
        val = users.filter((item) => item.name == "OSIS" || item.name == "IPPNU");
    }

    async function handleCome(id: number, candidate: number, index: number) {
        try {
            await fetch(`/api/come`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, candidate }),
            });
        } catch {
            toast.error("Gagal memilih");
        }
        finally {
            toast.success("Berhasil memlih");
            if (index == 0) {
                SetFirst(0);
            }
            else {
                SetSecond(0);
            }
        }

    }

    return (
        <div className="relative">
            <div className="text-xs absolute -top-5 left-2">{id}</div>
            <div className="flex-row">
                <div className="flex-col items-center justify-center min-h-screen mx-auto">
                    <Toaster position="top-center" />
                    {val.map((item, index) => (
                        <div key={index} className="bg-gray-50 shadow-md rounded-2xl text-black my-5 mx-20   flex-row items-center justify-center">
                            <div className="flex items-center justify-center gap-3 p-1">
                                <div className="text-2xl font-bold text-center">PEMILIHAN {item.name}</div>
                                <img src={item.img} alt={item.name} className="w-8" />
                            </div>
                            <div className={`flex items-end justify-center gap-7 p-5 ${item.name !== 'OSIS' ? 'bg-[#ACE1AF]' : 'bg-[#6CB4EE]'}`}>

                                {index == 0 && (
                                    item.votes.map((items, indexs) => (
                                        <button
                                            key={indexs}
                                            disabled={first == 0}
                                            onClick={() => handleCome(item.id, items.candidate.id, index)}
                                            className={`p-2 rounded-2xl hover:bg-amber-300 ${first == 0
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute bottom-0 bg-black w-full text-white h-14 flex items-center justify-center leading-tight"> {items.candidate.name}</div>
                                                    <img
                                                        src={items.candidate.img}
                                                        alt={items.candidate.name}
                                                        className="w-48 h-48 object-cover rounded-2xl"
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}

                                {index == 1 && (
                                    item.votes.map((items, indexs) => (
                                        <button
                                            key={indexs}
                                            disabled={second == 0}
                                            onClick={() => handleCome(item.id, items.candidate.id, index)}
                                            className={`p-2 rounded-2xl hover:bg-amber-300 ${second == 0
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute bottom-0 bg-black w-full text-white h-14 flex items-center justify-center leading-tight"> {items.candidate.name}</div>
                                                    <img
                                                        src={items.candidate.img}
                                                        alt={items.candidate.name}
                                                        className="w-48 h-48 object-cover rounded-2xl"
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}


                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="fixed bottom-6 right-6 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition cursor-pointer"
                    >
                        <LogOut />
                    </button>

                </div>
            </div>
        </div>
    );
}
