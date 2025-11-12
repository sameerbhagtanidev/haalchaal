"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";

import useAuth from "@/hooks/useAuth";
import {
    FaChevronUp,
    FaChevronDown,
    FaUserFriends,
    FaUserPlus,
} from "react-icons/fa";
import Link from "next/link";

import FriendsList from "./FriendsList";
import RequestsList from "./RequestsList";

export default function ChatSidebar() {
    const { user, logout } = useAuth();
    const [header, setHeader] = useState("friends");

    async function handleLogout() {
        try {
            await logout();
        } catch {}
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="cursor-pointer text-lg">
                                    {header === "friends" ? (
                                        <>
                                            <FaUserFriends /> Friends
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus /> Requests
                                        </>
                                    )}
                                    <FaChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]">
                                <DropdownMenuItem asChild className="text-base">
                                    <button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        onClick={() => setHeader("friends")}
                                    >
                                        <FaUserFriends /> Friends
                                    </button>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="text-base">
                                    <button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        onClick={() => setHeader("requests")}
                                    >
                                        <FaUserPlus /> Requests
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {header === "friends" && <FriendsList />}
                {header === "requests" && <RequestsList />}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="cursor-pointer text-lg">
                                    {user!.username}
                                    <FaChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="top"
                                className="w-[var(--radix-popper-anchor-width)]"
                            >
                                <DropdownMenuItem asChild className="text-base">
                                    <Link href="/" className="cursor-pointer">
                                        Home
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="text-base">
                                    <button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
