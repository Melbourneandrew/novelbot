"use client";
import { useState, useEffect } from "react";
import { IUser } from "@/lib/models/User";
import { IPurchase } from "@/lib/models/Purchase";
import { IEvent } from "@/lib/models/Event";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState({
    users: true,
    purchases: true,
    events: true,
  });

  function showSpotlight(docType: string, id: string) {
    router.push(`/admin/spotlight?doc=${docType}&id=${id}`);
  }
  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        isLoading.users = false;
        setIsLoading(isLoading);
        console.log(data);
        setUsers(data.users);
      });
    fetch("/api/admin/purchases")
      .then((res) => res.json())
      .then((data) => {
        isLoading.purchases = false;
        setIsLoading(isLoading);
        setPurchases(data.purchases);
      });
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        isLoading.events = false;
        setIsLoading(isLoading);
        setEvents(data.events);
      });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4 w-[100%]">
        {/* USERS COLUMN */}
        <div className="flex flex-col flex-1 gap-2 items-center max-h-[1000px] overflow-auto hide-scrollbar p-3">
          <h2>Users</h2>
          {isLoading.users && <LoadingIndicator />}
          {!isLoading.users && users.length === 0 && (
            <p>Nothing yet!</p>
          )}
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
        </div>
        {/* PURCHASES COLUMN */}
        <div className="flex flex-col flex-1 gap-2 items-center max-h-[1000px] overflow-auto hide-scrollbar p-3">
          <h2>Purchases</h2>
          {isLoading.purchases && <LoadingIndicator />}
          {!isLoading.purchases && purchases.length === 0 && (
            <p>Nothing yet!</p>
          )}
          {purchases.map((purchase, index) => (
            <div
              className="card w-96 bg-base-100 shadow-xl"
              key={index}
              onClick={() =>
                showSpotlight("Purchase", purchase._id)
              }
            >
              <div className="card-body">
                <h2 className="card-title">
                  {purchase.planName}
                </h2>
                <p>{purchase.emailProvided}</p>
                <p>Completed: {purchase.completed}</p>
              </div>
            </div>
          ))}
        </div>
        {/* EVENTS COLUMN */}
        <div className="flex flex-col flex-1 gap-2 items-center max-h-[1000px] overflow-auto hide-scrollbar p-3">
          <h2>Events</h2>
          {isLoading.events && <LoadingIndicator />}
          {!isLoading.events && events.length === 0 && (
            <p>Nothing yet!</p>
          )}
          {events.map((event, index) => (
            <div
              className="card w-96 bg-base-100 shadow-xl"
              key={index}
              onClick={() => showSpotlight("Event", event._id)}
            >
              <div className="card-body">
                <h2 className="card-title">{event.title}</h2>
                <p>{event.description}</p>
                <p>{parseDate(event.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseDate(dateString: string | undefined) {
  if (!dateString) return "??/??/?? ??:?? ??";
  const date = new Date(dateString);

  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().substr(-2);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let normalizedHours = hours.toString().padStart(2, "0");

  return `${month}/${day}/${year} ${normalizedHours}:${minutes} ${ampm}`;
}
