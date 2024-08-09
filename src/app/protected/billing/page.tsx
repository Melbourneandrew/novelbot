"use client";
import { useState, useEffect } from "react";
import { ISubscription } from "@/lib/models/Subscription";
import { IPurchase } from "@/lib/models/Purchase";
import Stripe from "stripe";
import ErrorMessage from "@/components/ErrorMessage";

interface SubscriptionPlanResponse {
  activeSubscription: ISubscription;
  stripeSubscriptionObject: Stripe.Subscription;
  stripeProductObject: Stripe.Product;
  stripePaymentMethod: Stripe.PaymentMethod;
}
export default function BillingPage() {
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlanResponse>();
  const [paymentHistory, setPaymentHistory] = useState<IPurchase[]>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchSubscriptionPlan = async () => {
    const response = await fetch("/api/billing/active-subscription");
    if (!response.ok) {
      const err = await response.text();
      setErrorMessage(err);
      console.log(err);
      return;
    }

    const data = await response.json();
    console.log("Subscription plan:", data);
    setSubscriptionPlan(data);
  };

  const fetchPaymentHistory = async () => {
    const response = await fetch("/api/billing/payment-history");
    if (!response.ok) {
      const err = await response.text();
      setErrorMessage(err);
      console.log(err);
      return;
    }

    const data = await response.json();
    console.log("Payment history: ", data);
    setPaymentHistory(data);
  };

  const cancelSubscription = async () => {
    console.log("Cancelling subscription");
    const response = await fetch("/api/billing/cancel-subscription");
    if (!response.ok) {
      const err = await response.text();
      setErrorMessage(err);
      console.log(err);
      return;
    }

    const data = await response.json();
    console.log("Subscription cancelled: ", data);
  };

  const updatePaymentMethod = async () => {
    const response = await fetch("/api/stripe/create-update-payment-session");
    if (!response.ok) {
      const err = await response.text();
      setErrorMessage(err);
      console.log(err);
      return;
    }

    const data = await response.json();
    window.location.href = data.url;
    console.log("Payment method update checkout session created: ", data);
  };

  useEffect(() => {
    fetchSubscriptionPlan();
    fetchPaymentHistory();
  }, []);
  return (
    <div>
      <h1>Billing</h1>
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* Plan Info */}
      <div className="flex items-center gap-2">
        {/* Plan title */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Plan title</div>
            <div className="stat-value">
              {subscriptionPlan?.stripeProductObject.name}
            </div>
          </div>
        </div>
        {/* Plan Cost */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Plan Cost</div>
            <div className="stat-value">
              $
              {(
                (subscriptionPlan?.stripeSubscriptionObject?.items?.data[0]
                  ?.plan?.amount || 0) / 100
              ).toFixed(2)}
            </div>
          </div>
        </div>
        {/* Renews */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Renews</div>
            <div className="stat-value">
              {new Date(
                (subscriptionPlan?.stripeSubscriptionObject
                  ?.current_period_end ?? 0) * 1000
              ).toLocaleDateString()}
            </div>
          </div>
        </div>
        {/* Card info */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Card Info</div>
            <div className="stat-value">
              {subscriptionPlan?.stripePaymentMethod?.card?.brand +
                " " +
                subscriptionPlan?.stripePaymentMethod?.card?.last4}
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => updatePaymentMethod()}
        >
          Change Payment Method
        </button>
        <button
          className="btn btn-primary"
          onClick={() => cancelSubscription()}
        >
          Cancel Plan
        </button>
      </div>
      {/* Billing History */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Plan</th>
              <th>Cost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
