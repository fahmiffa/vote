'use client';

import { useState, useRef, useEffect } from "react";
import { calon, Head } from "@/lib/type";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, PencilIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function Data() {

    useEffect(() => {
        fetchData();
        fetchCandidate();
    }, []);

    const [search, setSearch] = useState("");
    const [input, setInput] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [users, setUsers] = useState<Head[]>([]);
    async function fetchData() {
        try {
            const res = await fetch("/api/vote");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            } else {
                toast.error("Gagal mengambil data user");
            }
        } catch  {
            toast.error("Terjadi kesalahan saat fetch data");
        }
    }

    const [calon, setCalon] = useState<calon[]>([]);
    const [selectedPeserta, setSelectedPeserta] = useState<any[]>([]);
    async function fetchCandidate() {
        try {
            const res = await fetch("/api/calon");
            if (res.ok) {
                const data = await res.json();
                setCalon(data.users);
            } else {
                toast.error("Gagal mengambil data user");
            }
        } catch {
            toast.error("Terjadi kesalahan saat fetch data");
        }
    }

    const formRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState("")

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);

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
        setImage(null);
        setSelectedPeserta([]);
        setEditingUserId(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        const pesertaIds = selectedPeserta.map((p) => p.value);
        if (image) formData.append("image", image);

        if (pesertaIds.length > 0) {
            formData.append("calon", JSON.stringify(pesertaIds));
        }

        let res;
        if (editingUserId === null) {
            res = await fetch("/api/vote", {
                method: "POST",
                body: formData,
            });
        } else {
            res = await fetch(`/api/vote/${editingUserId}`, {
                method: "PUT",
                body: formData,
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
            const res = await fetch(`/api/vote/${id}`, {
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
        const sel = user.votes.map((i: any) => ({
            value: i.candidate.id,
            label: i.candidate.name
        }));
        setName(user.name);
        setEditingUserId(user.id);
        setInput(false);
        setSelectedPeserta(sel)
    }

    const options = calon.map((s) => ({
        value: s.id,
        label: `${s.name}`,
    }));

    const handleSelectChange = (selectedOptions: any) => {
        setSelectedPeserta(selectedOptions || []);
    };
    return (
        <div className="flex flex-col w-full">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold mb-4">{input ? 'Data Vote' : 'Tambah Vote'}</div>
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
                                    <th className="py-2 px-4 border-b text-left">Gambar</th>
                                    <th className="py-2 px-4 border-b text-left">Calon</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.img ? <img src={user.img} alt={user.name} className="w-15 rounded-full" /> : 'No image'}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            {user.votes.map((item, index) => (
                                                <div key={index}>{item.candidate.name}</div>
                                            ))}

                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.status == 1 ? 'Aktif' : 'Tidak Aktif'}</td>
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
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="space-y-4">
                            <div>
                                <label className="font-semibold text-xs">Nama</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-md p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-xs">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                    className="w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-xs">Calon</label>
                                <Select
                                    isMulti
                                    options={options}
                                    value={selectedPeserta}
                                    onChange={handleSelectChange}
                                    placeholder="Pilih Calon"
                                    className="w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white font-semibold hover:bg-green-600 rounded-2xl cursor-pointer"
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
