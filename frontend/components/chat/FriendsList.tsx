"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
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
    const { friends, setFriends, setActiveChat, newMessages, setNewMessages } =
        useChat();
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();

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

    const fetchNewMessages = useCallback(async () => {
        try {
            const res = await axios.get("/api/messages/new");
            setNewMessages(res.data.data.newMessages || []);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error fetching new messages. Please try again later.";

            toast.error(message);
        }
    }, [setNewMessages]);

    useEffect(() => {
        fetchFriends();
        fetchNewMessages();
    }, [fetchFriends, fetchNewMessages]);

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

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem className="flex">
                        <AddFriendDialog />
                    </SidebarMenuItem>

                    {friends && friends.length > 0 ? (
                        friends.map((friend) => {
                            const otherPerson =
                                friend.from!.username === user!.username
                                    ? friend.to
                                    : friend.from;

                            const otherUsername = otherPerson!.username;
                            const otherId = otherPerson!._id;

                            return (
                                <SidebarMenuItem
                                    key={friend._id}
                                    className="flex items-center gap-0.5"
                                >
                                    <SidebarMenuButton
                                        className="flex-1 cursor-pointer"
                                        onClick={() => {
                                            setActiveChat(friend);
                                            if (
                                                newMessages &&
                                                otherId in newMessages
                                            ) {
                                                setNewMessages((prev) => ({
                                                    ...prev,
                                                    [otherId]: 0,
                                                }));
                                            }

                                            toggleSidebar();
                                        }}
                                    >
                                        <FaUser />
                                        <span className="overflow-hidden text-base text-nowrap text-ellipsis">
                                            {otherUsername}
                                        </span>
                                    </SidebarMenuButton>

                                    {newMessages &&
                                        otherId in newMessages &&
                                        newMessages[otherId] !== 0 && (
                                            <div className="flex size-5 items-center justify-center rounded-full bg-gray-400 text-xs dark:bg-gray-700">
                                                {newMessages[otherId]}
                                            </div>
                                        )}

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
