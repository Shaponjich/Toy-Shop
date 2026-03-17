import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth';
import { CartItem } from '../models/cart.item.model';
import { Toy } from '../models/toy.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private auth: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getCartKey(): string {
    const user = this.auth.getLoggedInUser();
    return user ? `cart_user_${user.id}` : 'cart_guest';
  }

  getItems(): CartItem[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.getCartKey());
    return data ? JSON.parse(data) : [];
  }

  saveItems(items: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.getCartKey(), JSON.stringify(items));
    }
  }

  addToCart(toy: Toy): void {
    const items = this.getItems();
    const newItem: CartItem = {
      id: Date.now(),
      toy: toy,
      status: 'rezervisano',
      rating: 0
    };
    items.push(newItem);
    this.saveItems(items);
  }

  removeItem(id: number): void {
    let items = this.getItems();
    items = items.filter(i => i.id !== id);
    this.saveItems(items);
  }

  updateItem(updatedItem: CartItem): void {
    let items = this.getItems();
    const index = items.findIndex(i => i.id === updatedItem.id);
    if (index > -1) {
      items[index] = updatedItem;
      this.saveItems(items);
    }
  }

  clearCart(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.getCartKey());
    }
  }
  
  isInCart(toyId: number): boolean {
    return this.getItems().some(item => item.toy.toyId === toyId);
  }

  getTotalPrice(): number {
    return this.getItems().reduce((acc, curr) => acc + curr.toy.price, 0);
  }

  getAverageRating(toyId: number): number {
    if (!this.isBrowser) return 0;
    
    const allReviews: any[] = JSON.parse(localStorage.getItem('toyReviews') || '[]');
    const toyReviews = allReviews.filter(r => r.toyId === toyId);
    
    if (toyReviews.length === 0) return 0;

    const sum = toyReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / toyReviews.length;
  }

  rateItem(cartItemId: number, rating: number): void {
    if (!this.isBrowser) return;

    const items = this.getItems();
    const item = items.find(i => i.id === cartItemId);
    const user = this.auth.getLoggedInUser();

    if (item && user) {
      item.rating = rating;
      this.saveItems(items);

      const allReviews: any[] = JSON.parse(localStorage.getItem('toyReviews') || '[]');
      const userName = `${user.firstName} ${user.lastName}`;
      
      const existingIndex = allReviews.findIndex(r => r.toyId === item.toy.toyId && r.userName === userName);
      
      if (existingIndex > -1) {
        allReviews[existingIndex].rating = rating;
        allReviews[existingIndex].date = new Date();
      } else {
        allReviews.push({ 
          toyId: item.toy.toyId, 
          userName: userName, 
          rating: rating, 
          date: new Date() 
        });
      }
      
      localStorage.setItem('toyReviews', JSON.stringify(allReviews));
    }
  }
}