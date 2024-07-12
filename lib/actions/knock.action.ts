"use server";

import { Knock } from "@knocklabs/node";
import { error } from "console";
import { SendNotificationParams } from "./shared.types";
import { getUserById } from "./user.action";

const KNOCK_WORKFLOW = "in-app";

export async function identifyKnockUser(userId: string) {
  try {
    const mongoUser = await getUserById({ userId });
    if (!mongoUser) throw new Error("User is not exist");
    if (!process.env.KNOCK_SECRET_API_KEY)
      throw new Error("Knock API key secret is missing");

    // if (mongoUser.knockUserId) return mongoUser.knockUserId;

    const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

    const knockUser = await knockClient.users.identify(userId, {
      name: mongoUser.name,
    });

    // await updateUser({
    //   clerkId: userId,
    //   updateData: {
    //     knockUserId: knockUser.id,
    //   },
    //   path: "",
    // });

    return knockUser;
  } catch (e) {
    console.error(e);
    throw error;
  }
}

export async function notify(params: SendNotificationParams) {
  try {
    const TemplateTypeDefault = {
      Standard: "standard",
      SingleAction: "single-action",
      MultiAction: "multi-action",
    };
    const {
      title,
      message,
      userId,
      templateType = TemplateTypeDefault,
      sender = "A User",
      type = "message",
      url,
    } = params;

    const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

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
        url,
      },
    });
  } catch (e) {
    console.error(e);
    throw error;
  }
}
