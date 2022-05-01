import { userRoles } from '../store/user';
import { banUser } from '../store/admin';
import { UserRole, CreateUser } from '../types/user';
import { getUserID } from './user';

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

  return (await banUser(userID)) ? 'User banned✅' : 'Can not ban user🤷';
};
