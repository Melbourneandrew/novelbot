export default function ErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  if (message.length > 50) {
    message = message.substring(0, 50) + "...";
  }
  if (message.includes("<") || message.includes(">")) {
    message = "An error has occurred.";
  }
  return <p className={"text-red-500 " + className}>{message}</p>;
}
