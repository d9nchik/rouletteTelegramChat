import { stopSearching, userRoles } from '../store/user';
import { banUser, getUserHistory } from '../store/admin';
import { UserRole, CreateUser } from '../types/user';
import { getUserID } from './user';
import { stopConversation } from '../store/conversation';

export const ban = async (
  admin: CreateUser,
  userID: number
): Promise<string> => {
  const adminID = await getUserID(admin);

  const roles = await userRoles(adminID);
  if (!roles.includes(UserRole.admin)) {
    return 'You are not admin🔐';
  }
  if ((await userRoles(userID)).includes(UserRole.banned)) {
    return 'User is already banned😉';
  }

  if (!(await stopSearching(userID))) {
    return 'Can not stop searching🔍';
  }

  if (!(await stopConversation(userID))) {
    return 'Can not stop conversation🔌';
  }

  return (await banUser(userID)) ? 'User banned✅' : 'Can not ban user🤷';
};

export const userHistory = async (
  admin: CreateUser,
  userID: number
): Promise<string> => {
  const adminID = await getUserID(admin);

  const roles = await userRoles(adminID);
  if (!roles.includes(UserRole.admin)) {
    return 'You are not admin🔐';
  }

  let data = 'Time - userID - message\n';
  let previousConversationID = -1;
  let previousUserID = -1;

  for (const message of await getUserHistory(userID)) {
    if (message.conversationID !== previousConversationID) {
      data += `\n\nNew conversation: ${message.conversationID}\n`;
    }
    previousConversationID = message.conversationID;

    if (message.userID !== previousUserID) {
      data += `\nNew user: ${message.userID}\n`;
    }
    previousUserID = message.userID;

    data += `${message.time.toLocaleString()} - ${message.userID}:  ${
      message.message
    }\n`;
  }

  return data;
};
