import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationsService } from '../conversations.service';
import { AuthService } from '../../auth/auth.service';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule, AutofocusDirective],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  conversationsService = inject(ConversationsService);
  private router = inject(Router);
  private auth = inject(AuthService);

  conversations = this.conversationsService.conversations;
  loading = this.conversationsService.loading;
  loadError = this.conversationsService.loadError;
  user = this.auth.user;

  readonly maxConversations = 200;
  activeCount = computed(() => this.conversations().filter((c) => !c.archived).length);

  creating = signal(false);
  menuOpenId = signal<string | null>(null);
  editingId = signal<string | null>(null);
  editTitle = '';

  @HostListener('document:click')
  onDocumentClick() {
    this.menuOpenId.set(null);
  }

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

  toggleMenu(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.menuOpenId.update((prev) => (prev === id ? null : id));
  }

  startRename(event: MouseEvent, id: string, currentTitle: string) {
    event.stopPropagation();
    this.menuOpenId.set(null);
    this.editTitle = currentTitle;
    this.editingId.set(id);
  }

  async commitRename(id: string) {
    const title = this.editTitle.trim();
    this.editingId.set(null);
    if (!title) return;
    const current = this.conversations().find((c) => c.id === id)?.title;
    if (title !== current) {
      await this.conversationsService.updateTitle(id, title);
    }
  }

  cancelRename() {
    this.editingId.set(null);
  }

  onRenameKeydown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      void this.commitRename(id);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelRename();
    }
  }

  async archive(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.menuOpenId.set(null);
    await this.conversationsService.archiveConversation(id);
    if (this.router.url.includes(id)) {
      await this.router.navigate(['/c']);
    }
  }

  async deleteConversation(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.menuOpenId.set(null);
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
    if (this.editingId() === id) return;
    void this.router.navigate(['/c', id]);
  }

  isActive(id: string): boolean {
    return this.router.url === `/c/${id}`;
  }
}
