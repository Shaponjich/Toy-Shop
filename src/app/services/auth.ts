import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'loggedInUser';
  private readonly USERS_KEY = 'registeredUsers';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // Proveravamo da li smo u browseru
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Inicijalizacija samo ako smo u browseru
      if (!localStorage.getItem(this.USERS_KEY)) {
        const initialUser: User = {
          id: 1,
          firstName: 'Marko',
          lastName: 'Markovic',
          email: 'marko@email.com',
          phone: '0601234567',
          address: 'Ulica 1, Beograd',
          password: 'marko123',
          favoriteToyTypes: ['slagalica', 'figura']
        };
        localStorage.setItem(this.USERS_KEY, JSON.stringify([initialUser]));
      }
    }
  }

  private getUsers(): User[] {
    if (!this.isBrowser) return [];
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  login(email: string, password: string): boolean {
    if (!this.isBrowser) return false;
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(user: Omit<User, 'id'>): boolean {
    if (!this.isBrowser) return false;
    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) return false;

    const newUser: User = { ...user, id: users.length + 1 };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getLoggedInUser(): User | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(this.STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  updateProfile(updated: User): void {
    if (!this.isBrowser) return;
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      users[index] = updated;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
  }
}