import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { BLOG_BASE } from "@/lib/blog";

/** "Exit" in the preview bar: back to the site as visitors see it. */
export function GET() {
  draftMode().disable();
  redirect(BLOG_BASE);
}
