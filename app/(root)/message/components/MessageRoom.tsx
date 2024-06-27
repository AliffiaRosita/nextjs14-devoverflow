"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import type { Channel } from "stream-chat";
import { Menu, X } from "lucide-react";
import { Chat, LoadingIndicator, Streami18n } from "stream-chat-react";

import useInitializeChatClient from "@/hooks/useInitializeChatClient";

import { useTheme } from "@/context/ThemeProvider";

import useWindowSize from "@/hooks/useWindowSize";

import { mdBreakpoint } from "@/lib/tailwind";
import { registerServiceWorker } from "@/lib/serviceWorker";

import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "@/services/pushService";

import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import PushMessageListener from "./PushMessageListener";

import "@/styles/stream-chat.css";

const i18Instance = new Streami18n({ language: "en" });

const MessageRoom = ({
  channelId,
  userId,
}: {
  channelId?: string;
  userId?: string;
}) => {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();
  const { mode } = useTheme();

  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<Channel | undefined>(
    undefined
  );
  const [activeChannelId, setActiveChannelId] = useState<string | undefined>(
    channelId
  );

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) setChatSidebarOpen(false);
  }, [windowSize.width]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  }, []);

  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }
    syncPushSubscription();
  }, []);

  useEffect(() => {
    if (channelId) {
      history.replaceState(null, "", "/message");
    }
  }, [channelId]);

  useEffect(() => {
    if (userId === undefined) {
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
      <div className="flex items-center justify-center bg-gray-100 dark:bg-black">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="text-black dark:text-white">
      <div className="m-auto flex h-full min-w-[350px] max-w-[1600px] flex-col shadow-sm">
        <Chat
          client={chatClient}
          i18nInstance={i18Instance}
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
          <div className="flex h-full flex-row overflow-y-auto">
            {activeChannelId !== undefined && (
              <ChatSidebar
                user={user}
                show={isLargeScreen || chatSidebarOpen}
                onClose={handleSidebarOnClose}
                customActiveChannel={activeChannelId}
                resetActiveChannel={() => {
                  setActiveChannel(undefined);
                }}
              />
            )}
            <ChatChannel
              show={isLargeScreen || !chatSidebarOpen}
              hideChannelOnThread={!isLargeScreen}
              activeChannel={activeChannel}
            />
          </div>
          <PushMessageListener />
        </Chat>
      </div>
    </div>
  );
};

export default MessageRoom;
