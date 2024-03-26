"use client"
import { useState, useEffect, use } from 'react'

interface table {
    name: string
    count: number
}
export default function DbControls() {
    const [tables, setTables] = useState<table[]>([]);

    const getTables = async () => {
        const response = await fetch('/api/admin/tables');
        const data = await response.json();
        console.log(data)
        setTables(data);
    }
    useEffect(() => {
        getTables();
    }, []);
    return (
        <div>
            <h2 className="text-left">Database collections</h2>
            <div className="flex flex-wrap gap-1 mt-[10px] m-atuo w-[100%]">
                {tables.map((table: table, index: number) => (
                    <div className="card w-96 bg-base-100 shadow-xl w-[300px]" key={index}>
                        <div className="card-body">
                            <h2 className="card-title">{table.name}</h2>
                            <p>{table.count} records</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn">View</button>
                                <button className="btn btn-error">Delete</button>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}