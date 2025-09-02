'use client';

import { useState, useRef, useEffect } from "react";
import { user } from "@/lib/type";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, PencilIcon } from 'lucide-react';

export default function Data() {

    useEffect(() => {
        fetchData();
    }, []);

    const [search, setSearch] = useState("");
    const [input, setInput] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    async function fetchData() {
        try {
            const res = await fetch("/api/register"); // pastikan ini endpoint GET users
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


    const formRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [name, setName] = useState("")
    const [users, setUsers] = useState<user[]>([]);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    function resetForm() {
        setName("");
        setEmail("");
        setRole("");
        setEditingUserId(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !email || role === "") {
            toast.error("Semua field harus diisi");
            return;
        }

        let res;
        if (editingUserId === null) {
            // Create user
            res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: "jalan", name, role: Number(role) }),
            });
        } else {
            // Update user
            res = await fetch(`/api/register/${editingUserId}`, {
                method: "PUT",  // atau PATCH, tergantung API
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, role: Number(role) }),
            });
        }

        if (res.ok) {
            toast.success(editingUserId === null ? "Input Berhasil" : "Update Berhasil");
            resetForm();
            setInput(true);
            fetchData();
        } else {
            const data = await res.json();
            toast.error(data.error || "Terjadi kesalahan");
        }
    }
    async function handleDelete(id: number) {
        if (!confirm("Yakin ingin menghapus user ini?")) return;

        try {
            const res = await fetch(`/api/register/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("User berhasil dihapus");
                fetchData();
            } else {
                toast.error("Gagal menghapus user");
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus");
        }
    }

    function handleEdit(user: any) {
        setName(user.name);
        setEmail(user.email);
        setRole(String(user.role));
        setEditingUserId(user.id);  // pastikan user punya id unik
        setInput(false);
    }

    return (
        <div className="flex flex-col w-full">
            <Toaster position="top-right" />
            {/* Toggle Button */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold mb-4">{input ? 'Data User' : 'Tambah User'}</div>
                <button
                    onClick={() => setInput(!input)}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 rounded-2xl"
                >
                    {input ? "Tambah" : "Kembali"}
                </button>
            </div>

            {input ? (
                <>
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
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Role</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.role == 0 ? 'Admin' : 'User'}</td>
                                        <td className="py-2 px-4 border-b border-gray-300 space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 />
                                            </button>
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
                </>
            ) : (
                // Form Input
                <div ref={formRef}>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <option value="">Pilih Role</option>
                                <option value="0">Admin</option>
                                <option value="1">Perangkat</option>
                                <option value="2">Operator</option>
                            </select>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white font-semibold hover:bg-green-600 rounded-2xl"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
