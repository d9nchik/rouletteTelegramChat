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
import { getUserByID, stopSearching, startSearching } from '../store/user';

export const getCompanionIdentity = async (
  user: CreateUser
): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return userNotFound;
  }

  const userData = await companionIdentity(userID);
  if (!userData) {
    return 'You are not in conversation🕵️';
  }

  return `Fake name🎭: ${userData.fakeName}\nAge👴: ${
    userData.age
  }\nHobbies⛱: ${userData.hobbies ?? 'Not set'}\nFilms🎥: ${
    userData.films ?? 'Not set'
  }\nIn search🔎: ${userData.isSearching ? '✅' : '❌'}`;
};

export const stop = async (user: CreateUser): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return userNotFound;
  }

  if (await companionIdentity(userID)) {
    if (await stopConversation(userID)) {
      return 'Conversation stopped🔌';
    } else {
      return 'Can not stop conversation🔌';
    }
  }

  const userData = await getUserByID(userID);

  if (userData && userData.isSearching) {
    if (await stopSearching(userID)) {
      return 'Search stopped🔌';
    } else {
      return 'Can not stop search🔌';
    }
  }

  return 'You are not in search🔍';
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
    return { authorMessage: 'You are not in conversation🔌' };
  }

  if (!(await addLogMessage(userID, conversationChat, message))) {
    return { authorMessage: 'Can not send message🔍' };
  }

  const partnerIdentity = await companionIdentity(userID);
  if (!partnerIdentity) {
    return { authorMessage: 'You are not in conversation🔌' };
  }

  return {
    authorMessage: 'Delivered📩',
    participantMessage: message,
    participantChatID: String(conversationChat),
  };
};
