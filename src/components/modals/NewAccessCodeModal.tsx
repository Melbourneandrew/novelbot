"use client";

export default function BasicModal() {
  /**
   * Enable this modal with
   * <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
   */
  return (
    <dialog id="new_access_code_modal" className="modal">
      <div className="modal-box">
        <div className="text-[20px] font-bold text-lg">
          Create a New Reader Access Code
        </div>
        <p className="py-4">
          Access codes are used to allow readers to access your
          publication. You can create a new access code here.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[18px] font-bold">
              Code Name
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            <div className="text-[18px] font-bold">
              Code Value (add a custom one if you&apos;d like)
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            <div className="text-[18px] font-bold">
              Expiration Date
            </div>
            <input type="date" id="expires" name="expires" />
          </div>
          <div className="flex">
            <div className="text-[17px] mr-[30px]">
              Never expires
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="checkbox checkbox-primary"
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary">Create</button>
        </div>
      </div>
      {/* Second form to close the modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
