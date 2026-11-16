import { NextResponse, type NextRequest } from "next/server";
import { slugify } from "@/lib/slug";

/**
 * Detail pages look content up by its exact slug, so a badly formed URL such as
 * "/service/Metal construction" (old slugs, hand-typed or shared links) used to
 * end on a 404. Redirect it permanently to the clean form ("/service/metal-construction"),
 * which is what the slug field and the normalize-slugs migration store.
 */
export function proxy(request: NextRequest) {
  const [, section, rawSlug] = request.nextUrl.pathname.split("/");

  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    return NextResponse.next();
  }

  const clean = slugify(slug);
  if (!clean || clean === rawSlug) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${section}/${clean}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Only the detail routes keyed by slug (app/(app)/<section>/[slug]).
  matcher: ["/:section(service|sector|realisations|blog|career)/:slug"],
};
