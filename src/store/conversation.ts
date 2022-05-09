import pool from '.';
import { User } from '../types/user';
import { getUserByID } from './user';

export const companionIdentity = async (
  userID: number
): Promise<User | null> => {
  try {
    const res = await pool.query(
      `WITH active_chat AS (SELECT c.id
                            FROM conversation_participants cp
                                     JOIN conversation c on c.id = cp.conversation_id
                            WHERE (NOT c.is_ended)
                              AND participant = $1)
       SELECT cp.participant
       FROM conversation_participants cp
                JOIN active_chat ac ON ac.id = cp.conversation_id
       WHERE cp.participant <> $1;`,
      [userID]
    );
    if (res.rows.length === 0) {
      return null;
    }

    return getUserByID(res.rows[0].participant);
  } catch {
    return null;
  }
};

export const conversationChatID = async (
  userID: number
): Promise<number | null> => {
  try {
    const res = await pool.query(
      `SELECT c.id
       FROM conversation_participants cp
                JOIN conversation c on c.id = cp.conversation_id
       WHERE (NOT c.is_ended)
         AND participant = $1`,
      [userID]
    );
    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0].id;
  } catch {
    return null;
  }
};

export const stopConversation = async (userID: number): Promise<boolean> => {
  try {
    await pool.query(
      `UPDATE conversation c
       SET is_ended = TRUE
       FROM conversation_participants cp
       WHERE c.id = cp.conversation_id
        AND NOT c.is_ended
        AND cp.participant = $1;`,
      [userID]
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export async function startConversation(
  user1ID: number,
  user2ID: number
): Promise<boolean> {
  try {
    const res = await pool.query(
      `INSERT INTO conversation (is_ended) VALUES (FALSE) RETURNING id;`
    );
    const conversationID = res.rows[0].id;

    await pool.query(
      'INSERT INTO conversation_participants (conversation_id, participant) VALUES ($1, $2);',
      [conversationID, user1ID]
    );
    await pool.query(
      'INSERT INTO conversation_participants (conversation_id, participant) VALUES ($1, $2);',
      [conversationID, user2ID]
    );
    return true;
  } catch {
    return false;
  }
}

export async function findPartners(userID: number): Promise<number[]> {
  try {
    const res = await pool.query(
      `SELECT *
       FROM users
                LEFT JOIN block_list bl on users.id = bl.list_author
       WHERE is_searching
         AND users.id NOT IN (SELECT blocked_user_id
                              FROM block_list
                              WHERE list_author = $1)
         AND (bl.blocked_user_id IS NULL OR bl.blocked_user_id <> $1)`,
      [userID]
    );
    return res.rows.map(row => row.id);
  } catch {
    return [];
  }
}

export async function addLogMessage(
  sender: number,
  conversation_id: number,
  message: string
): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO logs (conversation_id, sender, message) VALUES ($1, $2, $3);`,
      [conversation_id, sender, message]
    );
    return true;
  } catch {
    return false;
  }
}
