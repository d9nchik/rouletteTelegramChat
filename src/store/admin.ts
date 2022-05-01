import pool from '.';
import { UserRole } from '../types/user';

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
