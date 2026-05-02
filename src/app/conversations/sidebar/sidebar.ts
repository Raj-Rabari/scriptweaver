import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConversationsService } from '../conversations.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  conversationsService = inject(ConversationsService);
  private router = inject(Router);
  private auth = inject(AuthService);

  conversations = this.conversationsService.conversations;
  loading = this.conversationsService.loading;
  user = this.auth.user;
  creating = signal(false);

  async newChat() {
    if (this.creating()) return;
    this.creating.set(true);
    try {
      const conv = await this.conversationsService.createConversation();
      await this.router.navigate(['/c', conv.id]);
    } finally {
      this.creating.set(false);
    }
  }

  async deleteConversation(event: MouseEvent, id: string) {
    event.preventDefault();
    event.stopPropagation();
    await this.conversationsService.deleteConversation(id);
    if (this.router.url.includes(id)) {
      await this.router.navigate(['/c']);
    }
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }

  navigate(id: string) {
    void this.router.navigate(['/c', id]);
  }

  isActive(id: string): boolean {
    return this.router.url === `/c/${id}`;
  }
}
