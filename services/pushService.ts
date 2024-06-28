import { getReadyServiceWorker } from "@/lib/serviceWorker";

export const getCurrentPushSubscription =
  async (): Promise<PushSubscription | null> => {
    const sw = await getReadyServiceWorker();
    return sw.pushManager.getSubscription();
  };

export const registerPushNotifications = async () => {
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser");
  }

  const existingSubscription = await getCurrentPushSubscription();

  if (existingSubscription) {
    throw Error("Existing push subscription found");
  }

  const sw = await getReadyServiceWorker();

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });

  await sendPushSubscriptionToServer(subscription);
};

export const unregisterPushNotifications = async () => {
  const existingSubscription = await getCurrentPushSubscription();

  if (!existingSubscription) {
    throw Error("No existing push subscription found");
  }

  await deletePushSubscriptionFromServer(existingSubscription);

  await existingSubscription.unsubscribe();
};

export const sendPushSubscriptionToServer = async (
  subscription: PushSubscription
) => {
  const response = await fetch("/api/register-push", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send push subscription to server");
  }
};

export const deletePushSubscriptionFromServer = async (
  subscription: PushSubscription
) => {
  const response = await fetch("/api/register-push", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to delete push subscription from server");
  }
};
