'use client';

import { useState, useRef, useEffect } from "react";
import { Pemilih } from "@/lib/type";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, PencilIcon } from 'lucide-react';
import ExcelJS from 'exceljs';

export default function Data() {

    useEffect(() => {
        fetchData();
    }, []);
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");
    const [input, setInput] = useState(true);
    const [loadiing, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

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

    const formRef = useRef<HTMLDivElement>(null);
    const [file, setFile] = useState<File | null>(null);

    async function handleExcelImport(e: React.FormEvent) {
        e.preventDefault();
        setShowModal(false);

        if (!file) {
            toast.error("Pilih file terlebih dahulu");
            return;
        }

        try {
            setLoading(true);
            const buffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const importedStudents: { name: string; kelas: string }[] = [];

            // Loop semua worksheet di workbook
            workbook.worksheets.forEach((worksheet) => {
                worksheet.eachRow((row, rowNumber) => {
                    // Skip header row
                    if (rowNumber === 1) return;

                    const name = row.getCell(1).text.trim();
                    const kelas = row.getCell(2).text.trim();

                    if (name && kelas) {
                        importedStudents.push({ name, kelas });
                    }
                });
            });

            for (const student of importedStudents) {
                await fetch("/api/pemilih", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(student),
                });
            }

            toast.success("Import Berhasil");
            resetForm();
            setInput(true);
            setLoading(false);
            fetchData();
        } catch (error) {
            toast.error(`Import Error: ${error}`);
        }
    }


    const [kelas, setKelas] = useState("")
    const [name, setName] = useState("")
    const [users, setUsers] = useState<Pemilih[]>([]);
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
        setKelas("");
        setEditingUserId(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !kelas) {
            toast.error("Semua field harus diisi");
            return;
        }

        let res;
        if (editingUserId === null) {
            // Create user
            res = await fetch("/api/pemilih", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, kelas }),
            });
        } else {
            // Update user
            res = await fetch(`/api/pemilih/${editingUserId}`, {
                method: "PUT",  // atau PATCH, tergantung API
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, kelas }),
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
            const res = await fetch(`/api/pemilih/${id}`, {
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
        setKelas(user.kelas);
        setEditingUserId(user.id);  // pastikan user punya id unik
        setInput(false);
    }

    return (
        <div className="flex flex-col w-full">
            {loadiing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
                </div>
            )}


            <Toaster position="top-right" />
            {/* Toggle Button */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">{input ? 'Data Pemilih' : 'Tambah Pemilih'}</div>
                {input && (
                    <div className="space-x-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-800 rounded-2xl"
                        >
                            Import Excel
                        </button>
                        <button
                            onClick={() => setInput(!input)}
                            className="px-4 py-2 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 rounded-2xl"
                        >
                            Tambah
                        </button>
                    </div>
                )}
                {!input && (
                    <button
                        onClick={() => setInput(!input)}
                        className="px-4 py-2 bg-green-500 text-white text-sm font-semibold hover:bg-green-600 rounded-2xl"
                    >
                        Kembali
                    </button>
                )}
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
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.kelas}</td>
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
                                type="text"
                                placeholder="Kelas"
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                className="w-full rounded-md p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
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


            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Import Excel</h2>
                        <form onSubmit={handleExcelImport}>
                            <input
                                type="file"
                                className="w-full rounded-md p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                                accept=".xlsx, .xls"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
