"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

import axios from "@/utils/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { FaChevronDown, FaUser, FaTrash } from "react-icons/fa";
import { FaCheck, FaX } from "react-icons/fa6";
import { BiLoaderAlt } from "react-icons/bi";
import useChat from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect, useCallback, useMemo } from "react";
import SkeletonRow from "../ui/SkeletonRow";

export default function RequestsList() {
    const { requests, setRequests } = useChat();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);

        try {
            const res = await axios.get("/api/relations/requests");
            setRequests(res.data.data.requests || []);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error fetching requests. Please try again later.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [setRequests]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const { receivedRequests, sentRequests } = useMemo(() => {
        const received: Relation[] = [];
        const sent: Relation[] = [];

        (requests || []).forEach((req) => {
            if (req.from!.username === user!.username) {
                sent.push(req);
            } else {
                received.push(req);
            }
        });

        return { receivedRequests: received, sentRequests: sent };
    }, [requests, user]);

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

    async function removeRequest(relationId: string) {
        if (loadingId) return;
        setLoadingId(relationId);

        try {
            const res = await axios.delete(
                `/api/relations/requests/${relationId}`,
            );

            setRequests((prevRequests) => {
                return prevRequests.filter(
                    (request) => request._id !== relationId,
                );
            });

            toast.success(res.data?.message || "Request deleted");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error removing request. Please try again later.";

            toast.error(message);
        } finally {
            setLoadingId(null);
        }
    }

    async function resolveRequest(relationId: string, action: string) {
        if (loadingId) return;
        setLoadingId(relationId);

        try {
            const res = await axios.patch(
                `/api/relations/requests/${relationId}`,
                { action },
            );

            setRequests((prevRequests) => {
                return prevRequests.filter(
                    (request) => request._id !== relationId,
                );
            });

            toast.success(res.data?.message || "Friend Request resolved");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error resolving request. Please try again later.";

            toast.error(message);
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <>
            {/* received */}
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none">
                            <span className="text-base">Received</span>
                            <FaChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {receivedRequests &&
                                receivedRequests.length > 0 ? (
                                    receivedRequests.map((request) => {
                                        return (
                                            <SidebarMenuItem
                                                key={request._id}
                                                className="flex items-center gap-0.5"
                                            >
                                                <SidebarMenuButton className="flex-1 cursor-pointer">
                                                    <FaUser />
                                                    <span className="overflow-hidden text-base text-nowrap text-ellipsis">
                                                        {request.from!.username}
                                                    </span>
                                                </SidebarMenuButton>

                                                <SidebarMenuButton
                                                    className="w-fit cursor-pointer hover:text-green-500"
                                                    disabled={Boolean(
                                                        loadingId,
                                                    )}
                                                    onClick={() =>
                                                        resolveRequest(
                                                            request._id,
                                                            "accept",
                                                        )
                                                    }
                                                >
                                                    {loadingId !==
                                                        request._id && (
                                                        <FaCheck />
                                                    )}
                                                </SidebarMenuButton>
                                                <SidebarMenuButton
                                                    className="w-fit cursor-pointer hover:text-red-500"
                                                    disabled={Boolean(
                                                        loadingId,
                                                    )}
                                                    onClick={() =>
                                                        resolveRequest(
                                                            request._id,
                                                            "reject",
                                                        )
                                                    }
                                                >
                                                    {loadingId ===
                                                    request._id ? (
                                                        <BiLoaderAlt className="animate-spin" />
                                                    ) : (
                                                        <FaX />
                                                    )}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })
                                ) : (
                                    <SidebarMenuItem className="text-muted-foreground px-3 py-2 text-sm">
                                        No requests received
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>

            {/* sent */}
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none">
                            <span className="text-base">Sent</span>
                            <FaChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {sentRequests && sentRequests.length > 0 ? (
                                    sentRequests.map((request) => {
                                        return (
                                            <SidebarMenuItem
                                                key={request._id}
                                                className="flex items-center gap-0.5"
                                            >
                                                <SidebarMenuButton className="flex-1 cursor-pointer">
                                                    <FaUser />
                                                    <span className="overflow-hidden text-base text-nowrap text-ellipsis">
                                                        {request.to!.username}
                                                    </span>
                                                </SidebarMenuButton>

                                                <SidebarMenuButton
                                                    className="w-fit cursor-pointer hover:text-red-500"
                                                    onClick={() =>
                                                        removeRequest(
                                                            request._id,
                                                        )
                                                    }
                                                    disabled={Boolean(
                                                        loadingId,
                                                    )}
                                                >
                                                    {loadingId ===
                                                    request._id ? (
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
                                        No requests sent
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        </>
    );
}
