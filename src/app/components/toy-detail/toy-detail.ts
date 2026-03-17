import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Toy } from '../../models/toy.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-toy-detail',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './toy-detail.html',
  styleUrl: './toy-detail.css'
})
export class ToyDetail implements OnInit {
  toy: Toy | null = null;
  loading = true;
  reviews: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private toyService: ToyService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const permalink = params.get('permalink');
      if (permalink) {
        this.toyService.getToyByPermalink(permalink).subscribe({
          next: (data) => {
            this.toy = data;
            this.loading = false;

            this.loadReviews(data.toyId);

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Greška pri učitavanju detalja:', err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  loadReviews(toyId: number) {
    if (typeof window !== 'undefined') {
      const allReviews = JSON.parse(localStorage.getItem('toyReviews') || '[]');

      this.reviews = allReviews.filter((r: any) => r.toyId === toyId);

      console.log('Učitane recenzije za igračku:', this.reviews);
      this.cdr.detectChanges();
    }
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.toy) {
      this.cartService.addToCart(this.toy);
      this.router.navigate(['/cart']);
    }
  }

  isInCart(): boolean {
    return this.toy ? this.cartService.isInCart(this.toy.toyId) : false;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    return `https://toy.pequla.com${imageUrl}`;
  }
}