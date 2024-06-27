import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PushSubscription } from "web-push";

interface PushSubscriptionWithSessionId extends PushSubscription {
  sessionId: string;
}

interface UserWithSubscriptions {
  privateMetadata: {
    subscriptions?: PushSubscriptionWithSessionId[];
  };
  id: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const newSubscription: PushSubscription | undefined = await req.json();

    if (!newSubscription) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    console.log("Received push subscription to add: ", newSubscription);

    const user = (await currentUser()) as UserWithSubscriptions;
    const { sessionId } = auth();

    if (!user || !sessionId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userSubscriptions: PushSubscriptionWithSessionId[] = Array.isArray(
      user.privateMetadata.subscriptions
    )
      ? user.privateMetadata.subscriptions
      : [];

    const updatedSubscriptions = userSubscriptions.filter(
      (subscription) => subscription.endpoint !== newSubscription.endpoint
    );

    updatedSubscriptions.push({ ...newSubscription, sessionId });

    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubscriptions },
    });

    return NextResponse.json(
      { message: "Push subscription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request): Promise<NextResponse> => {
  try {
    const subscriptionToDelete: PushSubscription | undefined = await req.json();

    if (!subscriptionToDelete) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    console.log("Received push subscription to delete: ", subscriptionToDelete);

    const user = (await currentUser()) as UserWithSubscriptions;

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userSubscriptions: PushSubscriptionWithSessionId[] = Array.isArray(
      user.privateMetadata.subscriptions
    )
      ? user.privateMetadata.subscriptions
      : [];

    const updatedSubscriptions = userSubscriptions.filter(
      (subscription) => subscription.endpoint !== subscriptionToDelete.endpoint
    );

    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubscriptions },
    });

    return NextResponse.json(
      { message: "Push subscription deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
