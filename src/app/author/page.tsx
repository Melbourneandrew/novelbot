"use client";
import { useState, useEffect } from "react";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import { ICharacter } from "@/lib/models/Character";
import { CharacterWithStats } from "../api/author/stats/route";
import { AuthorStatBoardData } from "../api/author/stats/route";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function AuthorHomeView() {
  const [authorStats, setAuthorStats] =
    useState<AuthorStatBoardData>({} as AuthorStatBoardData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStats = async () => {
    setIsLoading(true);
    const response = await fetch("/api/author/stats");
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    console.log(data);
    setIsLoading(false);
    setAuthorStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-left">All-Time Stats</h1>
      <div className="stats shadow mb-[25px]">
        {/* TOTAL READERS STAT */}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              className="inline-block h-8 w-8 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Readers</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">All-time</div>
        </div>
        {/* TOTAL CONVOS STAT*/}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              className="inline-block h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Conversations Had</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
        {/* TOTAL MESSAGES STAT */}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Messages</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
        {/* AVERAGE CHAT LENGTH STAT */}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              className="inline-block h-8 w-8 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Avg. Convo Length</div>
          <div className="stat-value">11</div>
          <div className="stat-desc">Messages</div>
        </div>
        {/* VIEW ALL HISTORY */}
        <div className="stat">
          <div className="stat-title">Chat History</div>
          <ButtonWithLoading className="btn btn-primary">
            View All
          </ButtonWithLoading>
        </div>
      </div>
      <h1 className="text-left">Character Stats</h1>
      <div className="flex overflow-x-auto gap-4 w-[1250px]">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="card bg-base-100 w-[384px] shadow-xl flex-shrink-0"
            >
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Shoes!</h2>
                <p>Total Convos: 100</p>
                <p>Avg. Convo Length: 10</p>
                <div className="card-actions justify-end">
                  <ButtonWithLoading className="btn btn-primary">
                    View History
                  </ButtonWithLoading>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
