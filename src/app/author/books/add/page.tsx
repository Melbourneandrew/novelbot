"use client"
import BackArrowIcon from "@/components/icons/BackArrowIcon";

export default function CreateBook() {
    return (
        <>
        <div className="flex gap-2 items-center mb-[25px]">
            <div>
                <BackArrowIcon size="28" />
            </div>
            <h1 className="text-left">Add Book</h1>

        </div>
        <div className="flex flex-col gap-4">
            <div>
                <div className="text-[25px] font-bold">Book title</div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </div>
            <div>
                <div className="text-[25px] font-bold">Book summary</div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </div>
            <div>
                <div className="text-[25px] font-bold">Book PDF</div>
                <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
                <p>Your book PDF will be used to collect your characters dialogue to create a chatbot that acts and sounds like them. The PDF will not be distributed and its contents will not be saved beyond what is necessary to support the creation of your characters bot profile.</p>
            </div>
            <button className="btn btn-primary w-fit wt-[20px]">Add book</button>
        </div>
        </>
    )
}