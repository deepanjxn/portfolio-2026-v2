import type { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}
