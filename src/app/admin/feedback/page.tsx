"use client";
import { IFeedback } from "@/lib/models/Feedback";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<IFeedback[]>([] as IFeedback[]);
  const [isLoading, setIsLoading] = useState(true);

  const showFeedbackSpotlight = (feedbackId: string) => {
    window.location.href = `/admin/spotlight?doc=Feedback&id=${feedbackId}`;
  };

  useEffect(() => {
    fetch("/api/feedback/list")
      .then((res) => res.json())
      .then(({ feedback }) => {
        console.log("Feedback: ", feedback);
        setIsLoading(false);
        setFeedback(feedback);
      });
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-2 items-center p-3">
      <h2>Feedback</h2>
      {isLoading && <LoadingIndicator />}
      {!isLoading && feedback.length === 0 && <p>Nothing yet!</p>}
      {feedback.map((submission: IFeedback, index) => (
        <div
          className="card w-[1000px] bg-base-100 shadow-xl"
          key={index}
          onClick={() => showFeedbackSpotlight(submission._id)}
        >
          <div className="card-body">
            <h2 className="card-title">
              Feedback from user: {submission.user.email}
            </h2>
            <p>{submission.userMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
