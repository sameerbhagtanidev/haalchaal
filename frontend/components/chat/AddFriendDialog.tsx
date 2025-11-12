"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addFriendSchema } from "@/validation/relation";
import InputMsg from "../ui/InputMsg";

type FormData = z.infer<typeof addFriendSchema>;

export default function AddFriendDialog() {
    const { user } = useAuth();
    const { setRequests, setFriends } = useChat();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(addFriendSchema),
    });

    const [open, setOpen] = useState(false);

    useEffect(reset, [reset, open]);

    async function onSubmit(formData: FormData) {
        if (isSubmitting) return;

        const username = formData["username"];

        if (username === user?.username) {
            toast.error("You cannot send a request to yourself");
            return;
        }

        try {
            const res = await axios.post("/api/relations/requests", {
                username,
            });

            const createdRequest: Relation = res.data?.data?.request;

            if (
                createdRequest &&
                createdRequest.status === "accepted" &&
                setFriends
            ) {
                setFriends((prev: Relation[] | undefined) =>
                    prev ? [...prev, createdRequest] : [createdRequest],
                );
            } else if (createdRequest && setRequests) {
                setRequests((prev: Relation[] | undefined) =>
                    prev ? [...prev, createdRequest] : [createdRequest],
                );
            }

            toast.success(res.data?.message || "Request sent");
            setOpen(false);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error sending request. Please try again later.";

            toast.error(message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton className="flex flex-1 cursor-pointer items-center justify-center text-2xl">
                    +
                </SidebarMenuButton>
            </DialogTrigger>

            <DialogContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col justify-center gap-4"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Send Friend Request
                        </DialogTitle>
                        <DialogDescription>
                            Enter the username of the person you want to add.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col justify-center gap-1">
                        <Input
                            placeholder="username"
                            autoFocus
                            className="text-lg"
                            {...register("username")}
                        />

                        {errors.username && (
                            <InputMsg theme="error">
                                {errors.username.message}
                            </InputMsg>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                            className="text-lg"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-lg"
                        >
                            {isSubmitting ? "Sending..." : "Send request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
