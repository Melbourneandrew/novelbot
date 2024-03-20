"use client"
import { useState } from 'react'
export default function DbControls() {
    const [tables, setTables] = useState(["user", "event", "subscription", "purchase", "author", "reader"]);
    return (<div className="flex gap-1">
        {tables.map((table, index: number) => (
            <div className="card w-96 bg-base-100 shadow-xl" key={index}>
                <div className="card-body">
                    <h2 className="card-title">{table}</h2>
                    <p>10,000 records</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn">View</button>
                        <button className="btn btn-error">Delete</button>
                    </div>
                </div>
            </div>

        ))}

    </div>)
}