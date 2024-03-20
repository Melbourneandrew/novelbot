"use client";
import { useState, useEffect } from "react";
import { IUser } from "@/lib/models/User";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import PlusIcon from "@/components/icons/PlusIcon";
export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  function showSpotlight(docType: string, id: string) {
    router.push(`/admin/spotlight?doc=${docType}&id=${id}`);
  }
  function makeUserAdmin() {
    async function makeAdmin() {
      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newAdminEmail }),
      });
      if (!response.ok) {
        console.log("Error making user admin");
        setErrorMessage(await response.text());
        return;
      }
      const data = await response.json();
      console.log(data);
      setNewAdminEmail("");
      setErrorMessage("");
      (
        document.getElementById(
          "add_admin_modal"
        ) as HTMLDialogElement
      ).close();
    }
    makeAdmin();
  }
  useEffect(() => {
    fetch("/api/admin/admin-users")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setUsers(data.users);
      });
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-2 items-center max-h-[1000px] overflow-auto hide-scrollbar p-3">
      <h2>Users</h2>
      {isLoading && <LoadingIndicator />}
      {users.map((user: IUser, index) => (
        <div
          className="card w-96 bg-base-100 shadow-xl"
          key={index}
          onClick={() => showSpotlight("User", user._id)}
        >
          <div className="card-body">
            <h2 className="card-title">{user.email}</h2>
            <p>id: {user._id}</p>
          </div>
        </div>
      ))}
      <div className="card w-96 bg-base-100 shadow-xl items-center pt-5">
        <div
          className="card-body"
          onClick={() =>
            (
              document.getElementById(
                "add_admin_modal"
              ) as HTMLDialogElement
            ).showModal()
          }
        >
          <h2 className="card-title">Add new admin user</h2>
          <div className="m-auto">
            <PlusIcon size={30} />
          </div>
        </div>
      </div>
      <dialog id="add_admin_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Enter email of user to promote to admin
          </h3>
          <p className="py-4">Email:</p>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button
            className="btn btn-primary mt-4"
            onClick={() => makeUserAdmin()}
          >
            Submit
          </button>
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
