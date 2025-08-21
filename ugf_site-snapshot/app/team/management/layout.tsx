import { ReactNode } from "react";

export default function ManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div data-management-page="true">
      <div className="flex-grow w-full">{children}</div>
      <div className="fixed inset-0 -z-10"></div>
    </div>
  );
}
