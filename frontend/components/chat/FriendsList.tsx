"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { FaUser, FaTrash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import useChat from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";

import axios from "@/utils/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useCallback, useState } from "react";
import SkeletonRow from "@/components/ui/SkeletonRow";

import AddFriendDialog from "@/components/chat/AddFriendDialog";

export default function FriendsList() {
    const { friends, setFriends } = useChat();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const fetchFriends = useCallback(async () => {
        setLoading(true);

        try {
            const res = await axios.get("/api/relations/friends");
            setFriends(res.data.data.friends || []);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error fetching friends. Please try again later.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [setFriends]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    if (!user || loading) {
        return (
            <SidebarGroup>
                <SidebarGroupContent aria-busy="true">
                    <SidebarMenu>
                        {[...new Array(5)].map((_, i) => (
                            <SidebarMenuItem key={`skeleton-${i}`}>
                                <SkeletonRow withAvatar lines={1} />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    async function removeFriend(relationId: string) {
        if (loadingId) return;
        setLoadingId(relationId);

        try {
            const res = await axios.delete(
                `/api/relations/friends/${relationId}`,
            );

            setFriends((prevFriends) => {
                return prevFriends.filter(
                    (friend) => friend._id !== relationId,
                );
            });

            toast.success(res.data?.message || "Friend removed");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error removing friend. Please try again later.";

            toast.error(message);
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem className="flex">
                        <AddFriendDialog />
                    </SidebarMenuItem>

                    {friends && friends.length > 0 ? (
                        friends.map((friend) => {
                            const friendUsername =
                                friend.fromUser!.username === user!.username
                                    ? friend.toUser!.username
                                    : friend.fromUser!.username;

                            return (
                                <SidebarMenuItem
                                    key={friend._id}
                                    className="flex"
                                >
                                    <SidebarMenuButton className="flex-1 cursor-pointer">
                                        <FaUser />
                                        <span className="overflow-hidden text-base text-nowrap text-ellipsis">
                                            {friendUsername}
                                        </span>
                                    </SidebarMenuButton>

                                    <SidebarMenuButton
                                        className="w-fit cursor-pointer hover:text-red-500"
                                        onClick={() => removeFriend(friend._id)}
                                        disabled={Boolean(loadingId)}
                                    >
                                        {loadingId === friend._id ? (
                                            <BiLoaderAlt className="animate-spin" />
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })
                    ) : (
                        <SidebarMenuItem className="text-muted-foreground px-3 py-2 text-sm">
                            No friends yet
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
