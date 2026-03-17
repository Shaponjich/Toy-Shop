import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToyService } from '../../services/toy';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Toy } from '../../models/toy.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toy-list',
  standalone: true,
  imports: [RouterLink,
    FormsModule,
    CurrencyPipe,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './toy-list.html',
  styleUrl: './toy-list.css'
})
export class ToyList implements OnInit {
  toys: Toy[] = [];
  filtered: Toy[] = [];

  searchName = '';
  searchType = '';
  searchAgeGroup = '';
  searchTargetGroup = '';
  searchMinPrice = '';
  searchMaxPrice = '';

  constructor(
    private toyService: ToyService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.toyService.getAllToys().subscribe({
      next: (data) => {
        this.toys = data.map(toy => {
          return {
            ...toy,
            rating: this.cartService.getAverageRating(toy.toyId)
          };
        });
        this.filtered = [...this.toys];

        console.log('Igračke učitane sa ocenama:', this.toys);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Greška:', err)
    });
  }

  applyFilters() {
    this.filtered = this.toys.filter(toy => {
      const matchName = !this.searchName || toy.name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchType = !this.searchType || (toy.type?.name || '').toLowerCase().includes(this.searchType.toLowerCase());
      const matchAge = !this.searchAgeGroup || (toy.ageGroup?.name || '').toLowerCase().includes(this.searchAgeGroup.toLowerCase());
      const matchTarget = !this.searchTargetGroup || toy.targetGroup === this.searchTargetGroup;
      const matchMin = !this.searchMinPrice || toy.price >= +this.searchMinPrice;
      const matchMax = !this.searchMaxPrice || toy.price <= +this.searchMaxPrice;

      return matchName && matchType && matchAge && matchTarget && matchMin && matchMax;
    });
    this.cdr.detectChanges();
  }

  resetFilters() {
    this.searchName = '';
    this.searchType = '';
    this.searchAgeGroup = '';
    this.searchTargetGroup = '';
    this.searchMinPrice = '';
    this.searchMaxPrice = '';
    this.filtered = [...this.toys];
    this.cdr.detectChanges();
  }

  addToCart(toy: Toy) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(toy);
  }

  isInCart(toyId: number): boolean {
    return this.cartService.isInCart(toyId);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `https://toy.pequla.com${imageUrl}`;
  }
}