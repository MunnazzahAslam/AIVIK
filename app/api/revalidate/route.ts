import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { BLOG_TAG } from "@/lib/sanity";

/**
 * Sanity calls this when an article, category, tag or author is published,
 * changed or removed. Everything built from the blog's data is then rebuilt on
 * its next visit: the index, the articles and the sitemap.
 *
 * The request is signed with SANITY_WEBHOOK_SECRET, so nobody else can trigger it.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "SANITY_WEBHOOK_SECRET is not set" }, { status: 500 });

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(BLOG_TAG);
  return Response.json({ revalidated: true });
}
