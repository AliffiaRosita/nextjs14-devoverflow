"use server";

import { Knock } from "@knocklabs/node";
import { SendNotificationParams } from "./shared.types";
import { getUserById } from "./user.action";

const KNOCK_WORKFLOW = "in-app";
const KNOCK_API_KEY = process.env.KNOCK_SECRET_API_KEY;

if (!KNOCK_API_KEY) {
  throw new Error("Knock API key secret is missing");
}

const knockClient = new Knock(KNOCK_API_KEY);

export async function identifyKnockUser(userId: string) {
  try {
    const mongoUser = await getUserById({ userId });
    if (!mongoUser) {
      throw new Error("User does not exist");
    }

    const knockUser = await knockClient.users.identify(userId, {
      name: mongoUser.name,
    });

    return knockUser;
  } catch (e) {
    console.error("Error identifying Knock user:", e);
    throw e;
  }
}

export async function sendNotification(params: SendNotificationParams) {
  try {
    const DEFAULT_TEMPLATE_TYPE = {
      Standard: "standard",
      SingleAction: "single-action",
      MultiAction: "multi-action",
    };

    const {
      title,
      message,
      userId,
      templateType = DEFAULT_TEMPLATE_TYPE,
      sender = "A User",
      type = "message",
      path,
    } = params;

    return await knockClient.workflows.trigger(KNOCK_WORKFLOW, {
      recipients: [userId],
      actor: userId,
      tenant: "user",
      data: {
        title,
        type,
        sender,
        message,
        templateType,
        path,
      },
    });
  } catch (e) {
    console.error("Error sending notification:", e);
    throw e;
  }
}
