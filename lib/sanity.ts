/**
 * Reads from Sanity, where the blog's content lives (the editor is in /studio).
 * The website only ever asks Sanity's HTTP API from the server: pages are built
 * from the answer and cached, so visitors never talk to Sanity themselves.
 */

export const SANITY_PROJECT_ID = "qs3r3e0a";
export const SANITY_DATASET = "production";
const API_VERSION = "2025-02-19";

/** Everything fetched for the blog carries this tag; the publish webhook clears it. */
export const BLOG_TAG = "blog";
// Without a webhook call, pages still catch up within the hour. This is also
// what makes an article with a future date appear on its day.
const REVALIDATE_SECONDS = 3600;

type Options = {
  /** Read unpublished changes too. Needs SANITY_READ_TOKEN and is never cached. */
  preview?: boolean;
};

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}, { preview = false }: Options = {}): Promise<T> {
  const url = new URL(`https://${SANITY_PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${SANITY_DATASET}`);
  url.searchParams.set("query", query);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(`$${name}`, JSON.stringify(value));
  url.searchParams.set("perspective", preview ? "drafts" : "published");

  const token = process.env.SANITY_READ_TOKEN;
  if (preview && !token) throw new Error("Sanity: SANITY_READ_TOKEN is needed to read drafts");

  const res = await fetch(url, {
    ...(preview
      ? { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" as const }
      : { next: { revalidate: REVALIDATE_SECONDS, tags: [BLOG_TAG] } }),
  });
  if (!res.ok) throw new Error(`Sanity: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { result: T }).result;
}
