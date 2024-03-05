export default function Dashboard() {
    const users = Array(10).fill("")
    const purchases = Array(10).fill("")
    return (
        <div className="flex flex-col items-center">
            <h1>Dashboard</h1>
            <div className="flex gap-4">
                {/* USERS COLUMN */}
                <div className="flex flex-col gap-2 max-h-[1000px] overflow-auto hide-scrollbar px-3">
                    <h2>Users</h2>
                    {users.map((user, index) =>
                        <div className="card w-96 bg-base-100 shadow-xl" key={index}>
                            <div className="card-body">
                                <h2 className="card-title">Card title!</h2>
                                <p>If a dog chews shoes whose shoes does he choose?</p>
                            </div>
                        </div>)}
                </div>
                {/* PURCHASES COLUMN */}
                <div className="flex flex-col gap-2 max-h-[1000px] overflow-auto hide-scrollbar px-3">
                    <h2>Purchases</h2>
                    {purchases.map((purchase, index) =>
                        <div className="card w-96 bg-base-100 shadow-xl" key={index}>
                            <div className="card-body">
                                <h2 className="card-title">Card title!</h2>
                                <p>If a dog chews shoes whose shoes does he choose?</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}