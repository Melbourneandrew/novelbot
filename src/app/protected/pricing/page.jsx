"use client";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingIndicator";
export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    getPlans();
  }, []);
  const getPlans = async () => {
    setIsLoading(true);
    let res = await fetch("/api/stripe/plans");
    res = await res.json();
    const plansList = [
      {
        name: "Trial",
        price: {
          unit_amount: 0,
        },
        features: [
          "Renews at 29.99/mo",
          "Feature 2",
          "Feature 3",
        ],
        default_price: "TRIAL",
      },
      ...res,
    ];
    console.log("Plans: ", plansList);
    setPlans(plansList);
    setIsLoading(false);
  };
  const handleSubscription = async (e, plan) => {
    e.preventDefault();
    const planName = plan.name;
    let priceId = plan.default_price;
    console.log("Price ID: ", priceId);
    let isTrial = false;
    if (priceId === "TRIAL") {
      priceId = plans[1].default_price;
      isTrial = true;
    }
    let response = await fetch("/api/stripe/create-payment-session", {
      method: "POST",
      body: JSON.stringify({
        priceId: priceId,
        isTrial: isTrial,
        planName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(!response.ok){
      const err = await response.text();
      setErrorMessage(err);
      console.error("Error creating session: ",err);
      return;
    }
    const data = await response.json();
    console.log("Stripe session created: ", data);
    window.open(data, "_blank").focus();
  };
  return (
    <div className="flex flex-col items-center justify-center w-[100%] h-[100vh]">
      <h1>Pricing</h1>
      <div className="flex gap-3">
        {isLoading && <LoadingSpinner />}
        {plans.map((plan, i) => (
          <div className="card w-80 glass" key={i}>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-[25px]">
                {plan.name}
              </h2>
              <h2 className=" text-[30px]">
                {`$${plan.price.unit_amount}` + "/mo"}
              </h2>
              <ul className="text-left list-disc">
                {plan.features?.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleSubscription(e, plan)}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="text-red-500">{errorMessage}</div>
      )}
    </div>
  );
}
