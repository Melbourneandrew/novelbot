"use client";
import { useEffect, useState } from "react";
export default function Pricing() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let res = await fetch("/api/stripe/products");
    res = await res.json();
    console.log("Products: ", res);
    const productsList = [
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
    setProducts(productsList);
  };
  const handleSubscription = async (e, priceId) => {
    e.preventDefault();
    console.log("Price ID: ", priceId);
    let isTrial = false;
    if (priceId === "TRIAL") {
      priceId = products[1].default_price;
      isTrial = true;
    }
    let res = await fetch("/api/stripe/payment/create", {
      method: "POST",
      body: JSON.stringify({
        priceId: priceId,
        isTrial: isTrial,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    res = await res.json();
    window.open(res, "_blank").focus();
  };
  return (
    <div className="flex flex-col items-center justify-center w-[100%] h-[100vh]">
      <h1>Pricing</h1>
      <div className="flex gap-3">
        {products.map((product, i) => (
          <div className="card w-80 glass" key={i}>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-[25px]">
                {product.name}
              </h2>
              <h2 className=" text-[30px]">
                {`$${product.price.unit_amount}` + "/mo"}
              </h2>
              <ul className="text-left list-disc">
                {product.features?.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={(e) =>
                    handleSubscription(e, product.default_price)
                  }
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
