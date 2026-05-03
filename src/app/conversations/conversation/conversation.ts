import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { marked } from 'marked';
import { ConversationsService } from '../conversations.service';

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-conversation',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation.html',
  styleUrls: ['./conversation.scss'],
})
export class Conversation implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLElement>;

  private route = inject(ActivatedRoute);
  private conversationsService = inject(ConversationsService);

  userPrompt = '';
  isLoading = signal(false);
  messages = signal<MessageItem[]>([]);
  conversationId = signal<string | null>(null);
  loadError = signal<string | null>(null);

  currentConversation = computed(() => {
    const id = this.conversationId();
    return id ? this.conversationsService.conversations().find((c) => c.id === id) ?? null : null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.conversationId.set(id);
      this.messages.set([]);
      this.loadError.set(null);
      if (id) void this.loadMessages(id);
    });
  }

  private async loadMessages(id: string) {
    try {
      const msgs = await this.conversationsService.loadMessages(id);
      this.messages.set(msgs.map((m) => ({ role: m.role, content: m.content })));
    } catch (err) {
      const status = err instanceof HttpErrorResponse ? err.status : 0;
      if (status !== 404) {
        this.loadError.set('Could not load messages. Please refresh.');
      }
    }
    this.scrollToBottom();
  }

  async generate() {
    const id = this.conversationId();
    if (!id || !this.userPrompt.trim() || this.isLoading()) return;

    this.isLoading.set(true);
    const prompt = this.userPrompt.trim();
    this.userPrompt = '';

    this.messages.update((list) => [...list, { role: 'user', content: prompt }]);
    const assistantIdx = this.messages().length;
    this.messages.update((list) => [...list, { role: 'assistant', content: '', loading: true }]);
    this.scrollToBottom();

    try {
      await this.conversationsService.sendMessage(id, prompt, (text) => {
        this.messages.update((list) => {
          const updated = [...list];
          updated[assistantIdx] = { role: 'assistant', content: text };
          return updated;
        });
        this.scrollToBottom();
      });
    } catch (err) {
      const status = err instanceof HttpErrorResponse ? err.status : 0;
      const content =
        status === 429
          ? 'Rate limit reached. Please wait a moment before sending another message.'
          : status === 403
            ? 'This conversation is full (50 messages). Please start a new chat.'
            : 'Something went wrong. Please try again.';
      this.messages.update((list) => {
        const updated = [...list];
        updated[assistantIdx] = { role: 'assistant', content, error: true };
        return updated;
      });
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.generate();
    }
  }

  getHtmlContent(markdown: string): string {
    return marked(markdown) as string;
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
