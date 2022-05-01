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
