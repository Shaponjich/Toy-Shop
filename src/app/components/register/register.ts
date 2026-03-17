import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  address = '';
  password = '';
  favoriteToyTypes = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    const success = this.auth.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      password: this.password,
      favoriteToyTypes: this.favoriteToyTypes.split(',').map(t => t.trim())
    });

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Korisnik sa ovim email-om već postoji.';
    }
  }
}