import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async submit() {
    if (!this.name || !this.email || !this.password) return;
    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signup(this.name, this.email, this.password);
      await this.router.navigate(['/c']);
    } catch (err: unknown) {
      const msg =
        (err as { error?: { error?: string } })?.error?.error ??
        'Sign up failed. Please try again.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.submit();
  }
}
