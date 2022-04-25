import { getUserIDByChatId, createUser, getUserByID } from '../store/user';
import { CreateUser } from '../types/user';
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
  names,
  countries,
} from 'unique-names-generator';

export async function getUserID(user: CreateUser): Promise<number> {
  const userID = await getUserIDByChatId(user.chatID);
  if (userID) {
    return userID;
  }
  return createUser(user);
}

const customConfig: Config = {
  dictionaries: [adjectives, colors, names, countries, animals],
  separator: ' ',
  length: 3,
};

export const generateName = (): string => uniqueNamesGenerator(customConfig); // big donkey
export const generateAge = (): number => Math.floor(Math.random() * 30) + 18;

export const getUserStatus = async (user: CreateUser): Promise<string> => {
  const userID = await getUserID(user);
  if (!userID) {
    return 'User not found';
  }

  const userData = await getUserByID(userID);
  if (!userData) {
    return 'User not found';
  }

  return `Fake name: ${userData.fakeName}\nAge: ${userData.age}\nHobbies: ${
    userData.hobbies ? userData.hobbies : 'Not set'
  }\nFilms: ${userData.films ? userData.films : 'Not set'}\nIn search: ${
    userData.isSearching ? '✅' : '❌'
  }`;
};
