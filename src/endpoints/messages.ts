import { Request, Response } from "express";
import { messageContent } from "../schemas";
import { getMessagePinned, getParams, sendError, sendSuccess } from "../utils";
import { prismaClient } from "../vars";
import { object } from "zod";
import { member_messages_pinned } from "@prisma/client";

const messageSchema = object({
  content: messageContent,
});

export async function createMessage(req: Request, res: Response) {
  const { content } = getParams(req, ["content"]);

  const schemaResult = messageSchema.safeParse({ content });

  if (!schemaResult.success) {
    return sendError(400, res, schemaResult.error.errors, true);
  }

  const messageData = await prismaClient.member_messages.create({
    data: {
      content,
      profile_id: req.userId,
      channel_id: req.channelId,
      server_id: req.serverId,
    },

    select: {
      id: true,
      content: true,
      server_id: true,
      channel_id: true,
      profile_id: true,
      created_at: true,
    },
  });

  return sendSuccess(res, { messageData }, true);
}

export async function editMessage(req: Request, res: Response) {
  const { content } = getParams(req, ["content"]);

  const schemaResult = messageSchema.safeParse({ content });

  if (!schemaResult.success) {
    return sendError(400, res, schemaResult.error.errors, true);
  }

  const messageData = await prismaClient.member_messages.update({
    where: {
      id: req.messageId,
      channel_id: req.channelId,
      server_id: req.serverId,
    },

    data: {
      content,
      edited: true,
    },

    select: {
      id: true,
      content: true,
      server_id: true,
      channel_id: true,
      profile_id: true,
      created_at: true,
    },
  });

  return sendSuccess(res, { messageData }, true);
}

export async function pinMessage(req: Request, res: Response) {
  const messagePinned = await getMessagePinned(
    req.serverId,
    req.channelId,
    req.messageId
  );

  const pinnedMessageData: Partial<member_messages_pinned> = {
    message_id: req.messageId,
    channel_id: req.channelId,
    server_id: req.serverId,
  };

  if (messagePinned) {
    return sendError(400, res, "Message already pinned.");
  }

  await prismaClient.member_messages_pinned.create({
    data: pinnedMessageData,
  });

  return sendSuccess(res, "Message pinned.");
}

export async function unpinMessage(req: Request, res: Response) {
  const messagePinned = await getMessagePinned(
    req.serverId,
    req.channelId,
    req.messageId
  );

  if (!messagePinned) {
    return sendError(400, res, "Message is not pinned.");
  }

  const pinnedMessageData: Partial<member_messages_pinned> = {
    message_id: req.messageId,
    channel_id: req.channelId,
    server_id: req.serverId,
  };

  await prismaClient.member_messages_pinned.deleteMany({
    where: pinnedMessageData,
  });

  return sendSuccess(res, "Message unpinned.");
}

export async function deleteMessage(req: Request, res: Response) {
  // TODO: Imagekit channel folder

  await prismaClient.member_messages.delete({
    where: {
      id: req.messageId,
      channel_id: req.channelId,
      server_id: req.serverId,
    },
  });

  return sendSuccess(res, "Message deleted.");
}
