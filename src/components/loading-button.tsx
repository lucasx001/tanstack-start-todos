import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface Props extends ComponentProps<typeof Button> {
  isPending?: boolean;
}

export function LoadingButton({
  isPending,
  onClick,
  className,
  ...props
}: Props) {
  return (
    <Button
      disabled={isPending}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...props}
      className={cn("relative", className)}
    >
      {isPending && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-transparent">
          <Spinner width={4} height={4} />
        </div>
      )}
      {props.children}
    </Button>
  );
}
