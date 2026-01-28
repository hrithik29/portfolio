import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
}

export default function Section({
  children,
  className = "",
  border = false,
}: SectionProps) {
  return (
    <section
      className={`py-10 sm:py-14 lg:py-16 ${
        border ? "border-t border-neutral-800" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
