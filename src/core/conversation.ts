import { getUserID, userNotFound } from './user';
import { CreateUser } from '../types/user';
import {
  companionIdentity,
  stopConversation as stopCommunication,
} from '../store/conversation';
import { getUserByID, stopSearching } from '../store/user';

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
    if (await stopCommunication(userID)) {
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
