import pool from '.';
import { User } from '../types/user';
import { getUserByID } from './user';

export const companionIdentity = async (
  userID: number
): Promise<User | null> => {
  try {
    const res = await pool.query(
      'SELECT receiver FROM conversation WHERE sender=$1 AND is_ended = FALSE;',
      [userID]
    );
    if (res.rows.length === 0) {
      return null;
    }

    return getUserByID(res.rows[0].receiver);
  } catch {
    return null;
  }
};

export const stopConversation = async (userID: number): Promise<boolean> => {
  try {
    await pool.query(
      'UPDATE conversation SET is_ended = TRUE WHERE sender=$1 OR receiver=$1;',
      [userID]
    );
    return true;
  } catch {
    return false;
  }
};
