'use client';

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PieChart from "./PieChart";
import { groupByHeadAndCandidate } from "./groupByHeadCandidate";


export default function Data() {
    const [chartData, setChartData] = useState<Record<string, { labels: string[], data: number[] }>>({});
    const [loading, setLoading] = useState(true);
    const [total, SetTotal] = useState(0);
    const [come, SetCOme] = useState(0);

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    async function fetchData() {
        try {
            const res = await fetch("/api/graph");
            if (res.ok) {
                const data = await res.json();
                SetCOme(data.masuk);
                SetTotal(data.total);
                const grouped = groupByHeadAndCandidate(data.item);

                const transformed: Record<string, { labels: string[], data: number[] }> = {};
                for (const head in grouped) {
                    const candidates = grouped[head];
                    transformed[head] = {
                        labels: Object.keys(candidates),
                        data: Object.values(candidates),
                    };
                }

                setChartData(transformed);
            } else {
                toast.error("Gagal mengambil data user");
            }
        } catch {
            toast.error("Terjadi kesalahan saat fetch data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center p-4">
            <h1 className="text-3xl font-semibold mb-1">Quick Count Realtime</h1>
            <div className="flex items-center justify-center gap-3 text-sm  font-semibold">
                <div>Data Masuk : {come}</div>
                <div>Data Belum Masuk : {total - come}</div>
                <div>Total : {total}</div>
            </div>
            <div className="flex items-center gap-3 justify-center">
                {loading ? (
                    <p>Loading chart...</p>
                ) : (
                    Object.entries(chartData).map(([head, chart]) => (
                        <PieChart key={head} title={`${head}`} labels={chart.labels} data={chart.data} />
                    ))
                )}
            </div>
        </div>
    );
}
