import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { CartItem } from '../../models/cart.item.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule, 
    RouterLink, 
    DatePipe,
    CurrencyPipe, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  items: CartItem[] = [];
  editingItem: CartItem | null = null;
  displayedColumns: string[] = ['image', 'name', 'price', 'status', 'rating', 'actions'];

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.refreshCart();
  }

  refreshCart() {
    this.items = [...this.cartService.getItems()];
    this.cdr.detectChanges();
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
    this.refreshCart();
  }

  startEdit(item: CartItem) {
    this.editingItem = { ...item };
  }

  saveEdit() {
    if (this.editingItem) {
      this.cartService.updateItem(this.editingItem);
      this.editingItem = null;
      this.refreshCart();
    }
  }

  cancelEdit() {
    this.editingItem = null;
  }

  rateItem(id: number, rating: number) {
    this.cartService.rateItem(id, rating);
    this.refreshCart();
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  getImageUrl(imageUrl: string): string {
    return `https://toy.pequla.com${imageUrl}`;
  }

  updateStatus(item: CartItem) {
    this.cartService.updateItem(item);
    this.refreshCart();
  }
}

export interface Review {
  toyId: number;
  userName: string;
  rating: number;
  date: Date;
}