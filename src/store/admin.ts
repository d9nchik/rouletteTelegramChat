import pool from '.';
import { UserRole } from '../types/user';
import { Message } from '../types/admin';

export const banUser = async (userID: number): Promise<boolean> => {
  try {
    await pool.query(
      'INSERT INTO user_roles (user_id, assigned_role) VALUES ($1, $2);',
      [userID, UserRole.banned]
    );
    return true;
  } catch {
    return false;
  }
};

export const getUserHistory = async (userID: number): Promise<Message[]> => {
  try {
    const res = await pool.query(
      `WITH user_conversations AS (SELECT c.id
                                   FROM conversation_participants cp
                                            JOIN conversation c on cp.conversation_id = c.id
                                   WHERE participant = $1)
       SELECT logs.*
       FROM logs
                RIGHT JOIN user_conversations uc ON uc.id = logs.conversation_id
       ORDER BY logs.id;`,
      [userID]
    );
    return res.rows.map(row => ({
      time: row.message_timestamp,
      message: row.message,
      userID: row.sender,
      conversationID: row.conversation_id,
    }));
  } catch {
    return [];
  }
};

export const getUserLastMessages = async (
  userID: number
): Promise<string[]> => {
  try {
    const res = await pool.query(
      `WITH user_conversations AS (SELECT c.id
                                   FROM conversation_participants cp
                                            JOIN conversation c on cp.conversation_id = c.id
                                   WHERE participant = $1)
       SELECT message
       FROM logs
                RIGHT JOIN user_conversations uc ON uc.id = logs.conversation_id
       WHERE sender = $1
       ORDER BY logs.id DESC
       LIMIT 1000;`,
      [userID]
    );
    return res.rows.map(row => row.message);
  } catch {
    return [];
  }
};
