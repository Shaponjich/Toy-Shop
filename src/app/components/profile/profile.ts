import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})

export class Profile implements OnInit {
  user: User | null = null;
  editMode = false;
  editData: User | null = null;
  favoriteToyTypesString = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshUser();
  }

  refreshUser() {
    this.user = this.auth.getLoggedInUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.cdr.detectChanges();
  }

  startEdit() {
    if (this.user) {
      this.editData = { ...this.user };
      this.favoriteToyTypesString = this.editData.favoriteToyTypes.join(', ');
      this.editMode = true;
    }
  }

  saveEdit() {
    if (this.editData) {
      this.editData.favoriteToyTypes = this.favoriteToyTypesString
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      this.auth.updateProfile(this.editData);
      this.editMode = false;
      this.refreshUser();
    }
  }
}