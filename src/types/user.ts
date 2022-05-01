export interface CreateUser {
  chatID: number;
  userName: string;
  fakeName: string;
  age: number;
}

export interface User {
  id: number;
  chatID: number;
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
