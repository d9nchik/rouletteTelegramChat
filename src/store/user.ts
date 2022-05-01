import { CreateUser, User } from '../types/user';
import pool from '.';

export async function createUser({
  chatID,
  userName,
  fakeName,
  age,
}: CreateUser): Promise<number> {
  try {
    const res = await pool.query(
      `INSERT INTO users (chat_id, username, fake_name, age)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [chatID, userName, fakeName, age]
    );
    return res.rows[0].id;
  } catch {
    return 0;
  }
}

export async function getUserIDByChatId(
  chatID: number
): Promise<number | null> {
  try {
    const res = await pool.query('SELECT id FROM users WHERE chat_id=$1;', [
      chatID,
    ]);

    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0].id;
  } catch {
    return null;
  }
}

export async function getUserByID(userID: number): Promise<User | null> {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id=$1;', [userID]);

    if (res.rows.length === 0) {
      return null;
    }

    return {
      ...res.rows[0],
      chatID: res.rows[0].chat_id,
      userName: res.rows[0].username,
      fakeName: res.rows[0].fake_name,
      isSearching: res.rows[0].is_searching,
    };
  } catch {
    return null;
  }
}

export async function setName(userID: number, name: string): Promise<boolean> {
  try {
    await pool.query('UPDATE users SET fake_name=$1 WHERE id=$2;', [
      name,
      userID,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function setHobbies(
  userID: number,
  hobbies: string
): Promise<boolean> {
  try {
    await pool.query('UPDATE users SET hobbies=$1 WHERE id=$2;', [
      hobbies,
      userID,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function setFilms(
  userID: number,
  films: string
): Promise<boolean> {
  try {
    await pool.query('UPDATE users SET films=$1 WHERE id=$2;', [films, userID]);
    return true;
  } catch {
    return false;
  }
}

export async function setAge(userID: number, age: number): Promise<boolean> {
  try {
    await pool.query('UPDATE users SET age=$1 WHERE id=$2;', [age, userID]);
    return true;
  } catch {
    return false;
  }
}
