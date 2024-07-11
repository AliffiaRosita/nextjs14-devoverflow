"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";

import Knock, { FeedItem, FeedStoreState } from "@knocklabs/client";

import { Bell, BellRing, MessageSquarePlus, Video } from "lucide-react";
import { useEffect, useState } from "react";

const AppNotification = ({ isUnreadExist = true }) => {
  const { userId } = useAuth();

  const knockClient = new Knock(
    process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY as string
  );

  knockClient.authenticate(userId);

  const knockFeed = knockClient.feeds.initialize(
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string,
    {
      page_size: 10,
      archived: "include",
    }
  );

  const [feed, setFeed] = useState<FeedStoreState>({} as FeedStoreState);
  const { toast } = useToast();

  const pushBrowserNotifications = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  useEffect(() => {
    knockFeed.listenForUpdates();
    const fetchFeed = async () => {
      await knockFeed.fetch();
      const feedState = knockFeed.getState();
      setFeed(feedState);
    };
    fetchFeed();
    knockFeed.on(
      "items.received.realtime",
      ({ items }: { items: FeedItem[] }) => {
        items.forEach((item) => {
          if (item.data && item.data.showToast) {
            const notificationType =
              item.data?.type === "message"
                ? "New Message"
                : "New Video Call Invitation";

            pushBrowserNotifications(notificationType);
            toast({
              title: `📨 ${notificationType}`,
              description: `You have a ${notificationType} from ${item.data?.sender || "A User"}`,
            });
          }
        });
        setFeed(knockFeed.getState());
      }
    );

    knockFeed.on("items.*", () => {
      setFeed(knockFeed.getState());
    });
  }, []);

  // async function markAllAsRead() {
  //   await knockFeed.markAllAsRead();
  // }

  // async function markAllAsArchived() {
  //   knockFeed.markAllAsArchived();
  // }

  // const dummyNotifications = [
  //   {
  //     id: 1,
  //     title: "New Message",
  //     type: "message",
  //     content: "You have a new message from John Doe",
  //     isRead: false,
  //     createdAt: new Date("2022-07-15T14:30:00"),
  //   },
  //   {
  //     id: 1,
  //     title: "New Video Call Invitation",
  //     type: "video_call",
  //     content: "You have a new Call Invitation from John Doe",
  //     isRead: true,
  //     createdAt: new Date("2022-07-15T14:30:00"),
  //   },
  // ];

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {isUnreadExist ? (
            <BellRing size={20} className="text-green-600" />
          ) : (
            <Bell size={20} className="text-dark500_light500" />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[310px] max-w-[310px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
          {feed.items?.map((notification, index) => {
            const textColor = !notification.read_at
              ? "text-primary-500"
              : "text-light400_light500";

            const iconColor = !notification.read_at ? "#008DDA" : "#858ead";
            const notificationType =
              notification.data?.type === "message"
                ? "New Message"
                : "New Video Call Invitation";

            return (
              <MenubarItem
                key={index}
                className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
                onClick={() => {
                  knockFeed.markAsRead(notification);
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex-start flex flex-row items-center gap-1">
                    {notification.data?.type === "message" ? (
                      <MessageSquarePlus size={15} color={iconColor} />
                    ) : (
                      <Video size={15} color={iconColor} />
                    )}
                    <p className={`body-semibold ${textColor}`}>
                      {notificationType}
                    </p>
                  </div>
                  <span className={`inline-block text-xs ${textColor}`}>
                    {" "}
                    {`You have a ${notificationType} from ${notification.data?.sender || "A User"}`}
                  </span>
                </div>
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default AppNotification;
