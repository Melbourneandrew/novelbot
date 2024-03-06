import { useRouter } from "next/router";

export default function SpotlightPage() {
  const router = useRouter();
  const { query } = router;
  const documentType = query.doc;
  const id = query.id;
  return (
    <div className="flex flex-col items-center">
      <h1>{documentType}</h1>
    </div>
  );
}
