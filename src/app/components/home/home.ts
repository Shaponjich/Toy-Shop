import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy';
import { Toy } from '../../models/toy.model';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  featuredToys: Toy[] = [];

  constructor(
    private toyService: ToyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.toyService.getAllToys().subscribe({
      next: (data) => {
        this.featuredToys = [...data.slice(0, 5)];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Greška na Home:', err)
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `https://toy.pequla.com${imageUrl}`;
  }
}