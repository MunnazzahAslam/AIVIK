import { coverSvg, isCoverStyle } from "@/lib/blog-covers";

// The same address always gives the same drawing, so it is made once and kept.
export const dynamic = "force-static";

/** /blog-cover/<style>/<article address>.svg: the animated cover for an article (lib/blog-covers.ts). */
export function GET(_request: Request, { params }: { params: { style: string; file: string } }) {
  const slug = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.svg$/.exec(params.file)?.[1];
  if (!isCoverStyle(params.style) || !slug) return new Response("Not found", { status: 404 });

  return new Response(coverSvg(params.style, slug), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=31536000" },
  });
}
