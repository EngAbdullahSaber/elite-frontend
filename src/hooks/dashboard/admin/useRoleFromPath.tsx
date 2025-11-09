"use client";

import { Role } from "@/types/global";
import { usePathname } from "next/navigation";

export function useRoleFromPath(): Role | undefined {
    const pathname = usePathname();
    const segments = pathname.split("/");


    const role = segments[2];

    if (role === "admin" || role === "marketer" || role === "agent") {
        return role;
    }

    return undefined;
}
