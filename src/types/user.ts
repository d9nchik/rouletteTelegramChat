export interface CreateUser {
  chatID: string;
  userName: string;
  fakeName: string;
  age: number;
}

export interface User {
  id: number;
  chatID: string;
  userName: string;
  fakeName: string;
  age: number;
  hobbies: string;
  films: string;
  isSearching: boolean;
}

export enum UserRole {
  admin = 'admin',
  banned = 'banned',
}
