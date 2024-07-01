"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Channel } from "stream-chat";
import { Menu, X } from "lucide-react";
import { Chat, LoadingIndicator, Streami18n } from "stream-chat-react";

import useInitializeChatClient from "@/hooks/useInitializeChatClient";
import { useTheme } from "@/context/ThemeProvider";
import useWindowSize from "@/hooks/useWindowSize";
import { mdBreakpoint } from "@/lib/tailwind";

import MessageChannel from "./MessageChannel";
import MessageSidebar from "./MessageSidebar";

import "@/styles/stream-chat.css";

const i18nInstance = new Streami18n({ language: "en" });
interface MessageProps {
  userId?: string;
}

const Message = ({ userId }: MessageProps) => {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();
  const { mode } = useTheme();

  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<Channel | undefined>(
    undefined
  );
  const [activeChannelId, setActiveChannelId] = useState<string | undefined>();

  const windowSize = useWindowSize();
  const isLargeScreen = useMemo(
    () => windowSize.width >= mdBreakpoint,
    [windowSize.width]
  );

  useEffect(() => {
    if (isLargeScreen) setChatSidebarOpen(false);
  }, [isLargeScreen]);

  useEffect(() => {
    if (!userId) {
      setActiveChannelId("");
    }
  }, [userId]);

  useEffect(() => {
    async function loadInitialChannel() {
      try {
        if (user && userId && chatClient) {
          const channel = chatClient.channel("messaging", {
            members: [userId, user.id],
          });
          await channel.create();
          setActiveChannel(channel);
          setActiveChannelId(channel.id);
        }
      } catch (error) {
        console.error(error);
        alert("Error creating channel");
      }
    }
    loadInitialChannel();
  }, [userId, user, chatClient]);

  const handleSidebarOnClose = useCallback(() => {
    setChatSidebarOpen(false);
  }, []);

  if (!chatClient || !user) {
    return (
      <div className="flex items-center justify-center dark:bg-black">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="h-full text-black dark:text-white">
      <div className="m-auto flex h-full min-w-[350px] flex-col shadow-sm">
        <Chat
          client={chatClient}
          i18nInstance={i18nInstance}
          theme={
            mode === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"
          }
        >
          <div className="flex justify-center border-b border-b-[#DBDDE1] p-3 md:hidden">
            <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}>
              {!chatSidebarOpen ? (
                <span className="flex items-center gap-1">
                  <Menu /> Menu
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex h-full flex-row overflow-y-auto rounded-[10px]">
            {activeChannelId !== undefined && (
              <MessageSidebar
                user={user}
                show={isLargeScreen || chatSidebarOpen}
                onClose={handleSidebarOnClose}
                customActiveChannel={activeChannelId}
                resetActiveChannel={() => {
                  setActiveChannel(undefined);
                }}
              />
            )}
            <MessageChannel
              show={isLargeScreen || !chatSidebarOpen}
              hideChannelOnThread={!isLargeScreen}
              activeChannel={activeChannel}
            />
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default Message;
