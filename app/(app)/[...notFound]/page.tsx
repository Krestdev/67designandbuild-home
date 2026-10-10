import { notFound } from "next/navigation";

// Catches any URL no other route matches so it renders the site's own
// not-found page (with header and footer) and a 404 status, instead of
// Next's bare default.
export default function CatchAll() {
  notFound();
}
