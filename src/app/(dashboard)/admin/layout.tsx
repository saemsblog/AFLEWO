/**
 * Admin sub-layout passthrough.
 * The (dashboard)/layout.tsx handles auth guarding for all routes under
 * /portal and /admin. This file exists purely to satisfy Next.js App Router
 * file conventions and passes children through without modification.
 */
export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
