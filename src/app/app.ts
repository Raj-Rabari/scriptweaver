import { Component, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from './api';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';

interface ConversationItem {
  prompt: string;
  response: string;
}

const STORAGE_KEY = 'scriptweaver_conversations';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLElement>;

  userPrompt = '';
  isLoading: WritableSignal<boolean> = signal(false);
  conversations: WritableSignal<ConversationItem[]> = signal([]);

  private apiService = inject(Api);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;

  ngOnInit() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.conversations.set(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  async generate() {
    if (!this.userPrompt.trim()) return;

    this.isLoading.set(true);
    const prompt = this.userPrompt.trim();
    this.userPrompt = '';

    const idx = this.conversations().length;
    this.conversations.set([...this.conversations(), { prompt, response: '' }]);
    this.scrollToBottom();

    try {
      await this.apiService.generateScript(prompt, (text) => {
        const updated = [...this.conversations()];
        updated[idx] = { prompt, response: text };
        this.conversations.set(updated);
        this.saveToStorage();
        this.scrollToBottom();
      });
    } catch {
      const updated = [...this.conversations()];
      updated[idx] = { prompt, response: 'Something went wrong while generating the content. Please try again later.' };
      this.conversations.set(updated);
      this.saveToStorage();
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.generate();
    }
  }

  clearHistory() {
    this.conversations.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  getHtmlContent(markdown: string): string {
    return marked(markdown) as string;
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations()));
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
