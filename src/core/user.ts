import {
  getUserIDByChatId,
  createUser,
  getUserByID,
  setName,
  setHobbies,
  setFilms,
  setAge,
  userRoles,
} from '../store/user';
import { CreateUser, UserRole } from '../types/user';
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
  names,
  countries,
} from 'unique-names-generator';

export const userNotFound = 'User not found';

const customConfig: Config = {
  dictionaries: [adjectives, colors, names, countries, animals],
  separator: ' ',
  length: 3,
};

export async function getUserID(user: CreateUser): Promise<number> {
  const userID = await getUserIDByChatId(user.chatID);
  if (userID) {
    return userID;
  }
  return createUser(user);
}

export const generateName = (): string => uniqueNamesGenerator(customConfig); // big donkey
export const generateAge = (): number => Math.floor(Math.random() * 30) + 18;

export const getUserStatus = async (user: CreateUser): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return userNotFound;
  }

  const userData = await getUserByID(userID);
  if (!userData) {
    return userNotFound;
  }

  return `Fake name🎭: ${userData.fakeName}\nAge👴: ${
    userData.age
  }\nHobbies⛱: ${userData.hobbies ?? 'Not set'}\nFilms🎥: ${
    userData.films ?? 'Not set'
  }\nIn search🔎: ${userData.isSearching ? '✅' : '❌'}`;
};

export const setUserName = async (user: CreateUser): Promise<boolean> => {
  const userID = await getUserID(user);
  if (!userID) {
    return false;
  }

  return setName(userID, user.fakeName);
};

export const updateHobbies = async (
  user: CreateUser,
  hobbies: string
): Promise<boolean> => {
  const userID = await getUserID(user);
  if (!userID) {
    return false;
  }

  return setHobbies(userID, hobbies);
};

export const updateFilms = async (
  user: CreateUser,
  films: string
): Promise<boolean> => {
  const userID = await getUserID(user);
  if (!userID) {
    return false;
  }

  return setFilms(userID, films);
};

export const updateAge = async (user: CreateUser): Promise<boolean> => {
  const userID = await getUserID(user);
  if (!userID) {
    return false;
  }

  return setAge(userID, user.age);
};

export const randomIdentity = async (user: CreateUser): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return userNotFound;
  }
  try {
    await setAge(userID, generateAge());
    await setName(userID, generateName());
    await setHobbies(userID, '');
    await setFilms(userID, '');
    return 'Identity updated';
  } catch {
    return 'Error';
  }
};

export const isUserBanned = async (user: CreateUser): Promise<boolean> => {
  const userID = await getUserID(user);
  if (!userID) {
    return false;
  }

  const roles = await userRoles(userID);
  return roles.includes(UserRole.banned);
};
