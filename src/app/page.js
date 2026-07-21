import { redirect } from 'next/navigation';

/**
 * Root page — immediately redirects to the default locale (/zh).
 * This is critical for Google indexing: Googlebot must get a clean
 * 308 redirect (not a 500 error) when hitting https://neo4d.live
 * Middleware handles browser users, this handles server-side crawlers.
 */
export default function RootPage() {
  redirect('/zh');
}
