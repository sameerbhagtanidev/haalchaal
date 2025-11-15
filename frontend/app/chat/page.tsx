"use client";

import RequireOnboarded from "@/components/auth/RequireOnboarded";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ChatSidebar from "@/components/chat/ChatSidebar";

import ChatWindow from "@/components/chat/ChatWindow";
import ChatProvider from "@/context/ChatProvider";

export default function Chat() {
    return (
        <RequireOnboarded>
            <ChatProvider>
                <SidebarProvider defaultOpen={false}>
                    <ChatSidebar />
                    <SidebarTrigger className="hover:text-primary mt-3 ml-3 cursor-pointer" />

                    <ChatWindow />
                </SidebarProvider>
            </ChatProvider>
        </RequireOnboarded>
    );
}
