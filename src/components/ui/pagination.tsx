import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"; 

import { cn } from "./utils";
import { Button, buttonVariants } from "./button";

// Container
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex justify-center", className)}
      {...props}
    />
  );
}

// UL wrapper
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex flex-row items-center gap-1 bg-white rounded-lg shadow-sm p-1",
        className
      )}
      {...props}
    />
  );
}

// LI wrapper
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

// Pagination Link
type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size,
        }),
        "min-w-[2rem] h-9 flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        props.onClick?.(e);
      }}
      {...props}
    />
  );
}

// Previous Button
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn(
        "px-3 flex items-center gap-1 text-gray-600 hover:text-gray-800",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

// Next Button
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn(
        "px-3 flex items-center gap-1 text-gray-600 hover:text-gray-800",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon className="w-4 h-4" />
    </PaginationLink>
  );
}

// First Button
function PaginationFirst({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      className={cn(
        "px-3 flex items-center gap-1 text-gray-600 hover:text-gray-800",
        className
      )}
      {...props}
    >
      <ChevronsLeftIcon className="w-4 h-4" />
      <span className="hidden sm:inline">First</span>
    </PaginationLink>
  );
}

// Last Button
function PaginationLast({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      className={cn(
        "px-3 flex items-center gap-1 text-gray-600 hover:text-gray-800",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">Last</span>
      <ChevronsRightIcon className="w-4 h-4" />
    </PaginationLink>
  );
}

// Ellipsis
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center w-9 h-9 text-gray-400",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="w-4 h-4" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
};
