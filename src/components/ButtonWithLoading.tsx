"use client";
import { useState, useRef } from "react";
import LoadingIndicator from "./LoadingIndicator";

interface ButtonWithLoadingProps {
  className: string;
  isLoading?: [boolean, Function];
  action?: Function;
  setErrorMessage?: Function;
  children: React.ReactNode;
}
export default function ButtonWithLoading({
  children,
  className,
  isLoading = useState(false),
  action = async () => {},
}: ButtonWithLoadingProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showLoadingIndicator, setShowLoadingIndicator] = isLoading;
  const runAction = async () => {
    setShowLoadingIndicator(true);
    await action();
    setShowLoadingIndicator(false);
  };
  return (
    <>
      <div
        className=" flex items-center justify-center"
        style={{ minWidth: buttonRef.current?.offsetWidth }}
      >
        {showLoadingIndicator ? (
          <div className="h-[48px] overflow-hidden flex items-center justify-center">
            <LoadingIndicator />
          </div>
        ) : (
          <button className={className} onClick={runAction} ref={buttonRef}>
            {children}
          </button>
        )}
      </div>
    </>
  );
}
