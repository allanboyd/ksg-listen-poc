import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Avatar({ children, className = "", ...rest }: AvatarProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <span className={`text-xs font-medium ${className}`}>{children}</span>;
}


