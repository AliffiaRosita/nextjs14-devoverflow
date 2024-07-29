'use client';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useToast } from '@/components/ui/use-toast';
import { SendNotificationParams } from '@/lib/actions/shared.types';
import { useAuth } from '@clerk/nextjs';
import Knock, { FeedItem, FeedStoreState } from '@knocklabs/client';
import { Bell, BellRing, MessageSquarePlus, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const knockClient = new Knock(
    process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY as string,
);

const AppNotification = ({ isUnreadExist = true }) => {
    const { userId, isLoaded } = useAuth();
    const [feed, setFeed] = useState<FeedStoreState>({} as FeedStoreState);
    const { toast } = useToast();
    const router = useRouter();

    const showNotification = (notification: SendNotificationParams) => {
        try {
            const pushNotification = new Notification(notification.title, {
                body: notification.message,
            });

            setTimeout(() => {
                pushNotification.close();
            }, 10 * 1000);

            pushNotification.onclick = () => {
                router.push(notification.path);
            };
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    };

    const pushBrowserNotifications = useCallback(
        (notification: SendNotificationParams) => {
            try {
                if (Notification.permission === 'granted') {
                    showNotification(notification);
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            showNotification(notification);
                        }
                    });
                }
            } catch (error) {
                console.error('Error pushing browser notifications:', error);
            }
        },
        [],
    );

    const showInAppNotification = useCallback(
        (title: string, description: string) => {
            try {
                toast({
                    title: `📨 ${title}`,
                    description,
                });
            } catch (error) {
                console.error('Error showing in-app notification:', error);
            }
        },
        [toast],
    );

    const knockFeed = useMemo(() => {
        if (!isLoaded || !userId) return null;

        try {
            knockClient.authenticate(userId);

            const feed = knockClient.feeds.initialize(
                process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string,
                {
                    page_size: 5,
                    archived: 'include',
                },
            );

            return feed;
        } catch (error) {
            console.error('Error initializing Knock feed:', error);
            return null;
        }
    }, [userId, isLoaded]);

    useEffect(() => {
        if (!knockFeed) return;

        const fetchFeed = async () => {
            try {
                await knockFeed.fetch();
                setFeed(knockFeed.getState());
            } catch (error) {
                console.error('Error fetching feed:', error);
            }
        };

        const handleItemsReceived = ({ items }: { items: FeedItem[] }) => {
            try {
                items.forEach(item => {
                    if (item.data) {
                        pushBrowserNotifications(
                            item.data as SendNotificationParams,
                        );
                        showInAppNotification(
                            item.data.title,
                            item.data.message,
                        );
                    }
                });
                setFeed(knockFeed.getState());
            } catch (error) {
                console.error('Error handling items received:', error);
            }
        };

        const handleItemsChanged = () => {
            try {
                setFeed(knockFeed.getState());
            } catch (error) {
                console.error('Error handling items changed:', error);
            }
        };

        knockFeed.listenForUpdates();
        fetchFeed();

        knockFeed.on('items.received.realtime', handleItemsReceived);
        knockFeed.on('items.*', handleItemsChanged);

        return () => {
            try {
                knockFeed.off('items.received.realtime', handleItemsReceived);
                knockFeed.off('items.*', handleItemsChanged);
            } catch (error) {
                console.error('Error cleaning up event listeners:', error);
            }
        };
    }, [knockFeed, showInAppNotification, pushBrowserNotifications]);

    if (!knockFeed) return null;

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
                    {feed.items?.length > 0 ? (
                        feed.items.map((notification, index) => {
                            const textColor = !notification.read_at
                                ? 'text-primary-500'
                                : 'text-light400_light500';
                            const iconColor = !notification.read_at
                                ? '#008DDA'
                                : '#858ead';

                            return (
                                <MenubarItem
                                    key={index}
                                    className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
                                    onClick={() => {
                                        try {
                                            const path =
                                                notification.data?.path;
                                            knockFeed.markAsRead(notification);
                                            router.push(path);
                                        } catch (error) {
                                            console.error(
                                                'Error marking notification as read:',
                                                error,
                                            );
                                        }
                                    }}>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex-start flex flex-row items-center gap-1">
                                            {notification.data?.type ===
                                            'message' ? (
                                                <MessageSquarePlus
                                                    size={15}
                                                    color={iconColor}
                                                />
                                            ) : (
                                                <Video
                                                    size={15}
                                                    color={iconColor}
                                                />
                                            )}
                                            <p
                                                className={`body-semibold ${textColor}`}>
                                                {notification.data?.title}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-block text-xs ${textColor}`}>
                                            {notification.data?.message}
                                        </span>
                                    </div>
                                </MenubarItem>
                            );
                        })
                    ) : (
                        <div className="flex justify-center items-center h-20">
                            <p className="text-light400_light500">
                                No new notifications
                            </p>
                        </div>
                    )}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default AppNotification;
