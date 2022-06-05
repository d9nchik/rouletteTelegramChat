import { stopSearching, userRoles } from '../store/user';
import { banUser, getUserHistory, getUserLastMessages } from '../store/admin';
import { UserRole, CreateUser } from '../types/user';
import { getUserID } from './user';
import { stopConversation } from '../store/conversation';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

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

export async function tryBanBySentiment(userID: number): Promise<boolean> {
  try {
    const messages = await getUserLastMessages(userID);

    for (const message of messages) {
      if (isUserRude(message)) {
        return banWithoutCheckingPrivilege(userID);
      }
    }

    return false;
  } catch {
    return false;
  }
}

async function banWithoutCheckingPrivilege(userID: number): Promise<boolean> {
  if ((await userRoles(userID)).includes(UserRole.banned)) {
    console.error(`User is already banned😉: ${userID}`);
    return false;
  }

  if (!(await stopSearching(userID))) {
    console.error(`Can not stop searching🔍: ${userID}`);
    return false;
  }

  if (!(await stopConversation(userID))) {
    console.error(`Can not stop conversation🔌: ${userID}`);
    return false;
  }

  if (!(await banUser(userID))) {
    console.error(`Can not ban user🤷: ${userID}`);
    return false;
  }

  console.log(`User banned✅: ${userID}`);
  return true;
}

function isUserRude(message: string): boolean {
  return sentiment.analyze(message).score < -3;
}
