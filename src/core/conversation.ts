import { getUserID, userNotFound } from './user';
import { CreateUser } from '../types/user';
import { ConversationMessage } from '../types/conversation';
import {
  companionIdentity,
  stopConversation,
  findPartners,
  startConversation,
  addLogMessage,
  conversationChatID,
} from '../store/conversation';
import {
  getUserByID,
  stopSearching,
  startSearching,
  blockUser,
} from '../store/user';
import { NotiFyAdminMessage } from '../types/admin';
import { tryBanBySentiment } from './admin';

const notInConversation = 'You are not in conversation🕵️';
const canNotStopConversation = 'Can not stop conversation🔌';
const userBlockedMessage = 'User blocked🔕';

export const getCompanionIdentity = async (
  user: CreateUser
): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return userNotFound;
  }

  const userData = await companionIdentity(userID);
  if (!userData) {
    return notInConversation;
  }

  return `Fake name🎭: ${userData.fakeName}\nAge👴: ${
    userData.age
  }\nHobbies⛱: ${userData.hobbies ?? 'Not set'}\nFilms🎥: ${
    userData.films ?? 'Not set'
  }`;
};

export const stop = async (user: CreateUser): Promise<ConversationMessage> => {
  const userID = await getUserID(user);
  if (!userID) {
    return { authorMessage: userNotFound };
  }

  const companion = await companionIdentity(userID);
  if (companion) {
    if (await stopConversation(userID)) {
      return {
        authorMessage: 'Conversation stopped🔌',
        participantMessage: 'Conversation stopped🔌',
        participantChatID: companion.chatID,
      };
    } else {
      return { authorMessage: canNotStopConversation };
    }
  }

  const userData = await getUserByID(userID);

  if (userData && userData.isSearching) {
    if (await stopSearching(userID)) {
      return { authorMessage: 'Search stopped🔌' };
    } else {
      return { authorMessage: 'Can not stop search🔌' };
    }
  }

  return { authorMessage: 'You are not in search🔍' };
};

export const findCompanion = async (
  user: CreateUser
): Promise<ConversationMessage> => {
  const userID = await getUserID(user);
  if (!userID) {
    return { authorMessage: userNotFound };
  }

  if (await companionIdentity(userID)) {
    return { authorMessage: 'You are already in conversation🔌' };
  }

  const userData = await getUserByID(userID);
  if (!userData) {
    return { authorMessage: userNotFound };
  }
  if (userData.isSearching) {
    return { authorMessage: 'You are already searching🔍' };
  }

  const partners = await findPartners(userID);
  if (partners.length) {
    const partner = partners[Math.floor(Math.random() * partners.length)];
    await stopSearching(partner);
    await startConversation(userID, partner);

    const partnerIdentity = await getUserByID(partner);
    if (!partnerIdentity) {
      return { authorMessage: userNotFound };
    }

    return {
      authorMessage: await getCompanionIdentity(user),
      participantMessage: await getCompanionIdentity(partnerIdentity),
      participantChatID: partnerIdentity.chatID,
    };
  }

  if (!(await startSearching(userID))) {
    return { authorMessage: 'Can not start search🔍' };
  }

  return { authorMessage: 'Search started🔍' };
};

export const sendMessage = async (
  user: CreateUser,
  message: string
): Promise<ConversationMessage> => {
  const userID = await getUserID(user);
  if (!userID) {
    return { authorMessage: userNotFound };
  }

  const conversationChat = await conversationChatID(userID);
  if (!conversationChat) {
    return { authorMessage: notInConversation };
  }

  if (!(await addLogMessage(userID, conversationChat, message))) {
    return { authorMessage: 'Can not send message🔍' };
  }

  const partnerIdentity = await companionIdentity(userID);
  if (!partnerIdentity) {
    return { authorMessage: notInConversation };
  }

  return {
    authorMessage: 'Delivered📩',
    participantMessage: message,
    participantChatID: partnerIdentity.chatID,
  };
};

export const blockCompanion = async (
  user: CreateUser
): Promise<ConversationMessage> => {
  const userID = await getUserID(user);
  if (!userID) {
    return { authorMessage: userNotFound };
  }

  const companion = await companionIdentity(userID);
  if (!companion) {
    return { authorMessage: notInConversation };
  }

  if (!(await blockUser(userID, companion.id))) {
    return { authorMessage: 'Can not block user🔍' };
  }

  if (!(await stopConversation(userID))) {
    return { authorMessage: canNotStopConversation };
  }

  return {
    authorMessage: userBlockedMessage,
    participantMessage: `You're blocked🔕`,
    participantChatID: companion.chatID,
  };
};

export const reportCompanion = async (
  user: CreateUser
): Promise<NotiFyAdminMessage> => {
  const userID = await getUserID(user);
  if (!userID) {
    return { authorMessage: userNotFound };
  }

  const companion = await companionIdentity(userID);
  if (!companion) {
    return { authorMessage: notInConversation };
  }

  if (!(await blockUser(userID, companion.id))) {
    return { authorMessage: 'Can not block user🔍' };
  }

  if (!(await stopConversation(userID))) {
    return { authorMessage: canNotStopConversation };
  }

  if (await tryBanBySentiment(companion.id)) {
    return {
      authorMessage: userBlockedMessage,
      participantMessage: `You're blocked🔕`,
      participantChatID: companion.chatID,
    };
  }

  return {
    authorMessage: userBlockedMessage,
    participantMessage: `You're blocked🔕`,
    participantChatID: companion.chatID,
    adminMessage: `${companion.id} has action of ban.\nToo see conversation enter: /user_logs ${companion.id}`,
  };
};
