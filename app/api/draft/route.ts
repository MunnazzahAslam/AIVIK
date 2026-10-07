import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { BLOG_BASE, blogPath } from "@/lib/blog";
import { sanityFetch } from "@/lib/sanity";

/**
 * "Open preview" in the Studio lands here. The Studio stores a one-time secret
 * in Sanity (readable only with our token) and passes it along; if it matches
 * and is under an hour old, this browser sees unpublished changes until "Exit".
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") as Locale;

  if (!secret || !process.env.SANITY_READ_TOKEN) return new Response("Preview is not available", { status: 401 });

  const known = await sanityFetch<number>(
    `count(*[_type == "previewSecret" && secret == $secret && dateTime(_updatedAt) > dateTime(now()) - 3600])`,
    { secret },
    { preview: true },
  );
  if (!known) return new Response("This preview link has expired. Open the preview from the Studio again.", { status: 401 });

  draftMode().enable();

  const prefix = routing.locales.includes(locale) && locale !== routing.defaultLocale ? `/${locale}` : "";
  // Only ever to one of our own blog pages.
  redirect(`${prefix}${slug && /^[a-z0-9-]+$/.test(slug) ? blogPath(slug) : BLOG_BASE}`);
}
