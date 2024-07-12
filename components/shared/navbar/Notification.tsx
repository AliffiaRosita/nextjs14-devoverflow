"use client";

// import { useNotification } from "@/context/NotificationProvider";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Bell, BellRing, MessageSquarePlus, Video } from "lucide-react";

const Notification = ({ isUnreadExist = true }) => {
  // const { mode, setMode } = useNotification();

  const dummyNotifications = [
    {
      id: 1,
      title: "New Message",
      type: "message",
      content: "You have a new message from John Doe",
      isRead: false,
      createdAt: new Date("2022-07-15T14:30:00"),
    },
    {
      id: 1,
      title: "New Video Call Invitation",
      type: "video_call",
      content: "You have a new Call Invitation from John Doe",
      isRead: true,
      createdAt: new Date("2022-07-15T14:30:00"),
    },
  ];
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
          {dummyNotifications.map((notification, index) => {
            const textColor = !notification.isRead
              ? "text-primary-500"
              : "text-light400_light500";

            const iconColor = !notification.isRead ? "#008DDA" : "#858ead";

            return (
              <MenubarItem
                key={index}
                className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
                onClick={() => {
                  // setMode(theme.value);
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex-start flex flex-row items-center gap-1">
                    {notification.type === "message" ? (
                      <MessageSquarePlus size={15} color={iconColor} />
                    ) : (
                      <Video size={15} color={iconColor} />
                    )}
                    <p className={`body-semibold ${textColor}`}>
                      {notification.title}
                    </p>
                  </div>
                  <span className={`inline-block text-xs ${textColor}`}>
                    {" "}
                    {notification.content}
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

export default Notification;
