import { getUserIDByChatId, createUser } from '../store/user';
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
