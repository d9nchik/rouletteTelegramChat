import { getUserID, userNotFound } from './user';
import { CreateUser } from '../types/user';
import { companionIdentity } from '../store/conversation';

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
