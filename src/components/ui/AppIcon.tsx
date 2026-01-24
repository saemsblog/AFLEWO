// src/components/ui/AppIcon.tsx
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type AppIconProps = {
    name: string;
    size?: number;
    className?: string;
    "aria-hidden"?: boolean;
};

export default function AppIcon({
    name,
    size = 24,
    className,
    "aria-hidden": ariaHidden = true,
}: AppIconProps) {
    return (
        <Icon
            icon={`material-symbols:${name}`}
            width={size}
            height={size}
            className={cn("inline-block", className)}
            aria-hidden={ariaHidden}
        />
    );
}
