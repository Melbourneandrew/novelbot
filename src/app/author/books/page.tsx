"use client"
export default function AuthorBooksDashboard() {
    return (
        <>
        <h1 className="text-left">Books Dashboard</h1>
        <div className="flex flex-wrap">
            {Array(8).fill(0).map((val, index) => 
                <div className="rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]">
                    <h2 className="text-lg font-semibold mb-2">Card Title</h2>
                    <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL3JtNTM1LWJvb2stMDJhXzEucG5n.png" alt="Card Image" className="w-full h-40 object-cover rounded-md mb-2" />
                    <p className="text-gray-600">This is a brief description of the card content. You can add more details as needed.</p>
                </div>
            )}
            <div className="flex justify-center items-center rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]">
                    <div className="text-[150px]">+</div>
                </div>
        </div>
        </>
    )
}