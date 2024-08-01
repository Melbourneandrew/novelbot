"use client";

import LoadingIndicator from "./LoadingIndicator";

interface ButtonWithLoadingProps {
  text: string;
  className: string;
  isLoading: boolean;
}
export default function ButtonWithLoading({
  text,
  className,
  isLoading,
}: ButtonWithLoadingProps) {
  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <button className={className}>{text}</button>
      )}
    </>
  );
}
