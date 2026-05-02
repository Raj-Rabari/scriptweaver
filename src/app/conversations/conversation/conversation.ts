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
import { marked } from 'marked';
import { Api } from '../../api';
import { ConversationsService } from '../conversations.service';

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
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
  private apiService = inject(Api);
  private conversationsService = inject(ConversationsService);

  userPrompt = '';
  isLoading = signal(false);
  messages = signal<MessageItem[]>([]);
  conversationId = signal<string | null>(null);

  currentConversation = computed(() => {
    const id = this.conversationId();
    return id ? this.conversationsService.conversations().find((c) => c.id === id) ?? null : null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.conversationId.set(id);
      this.messages.set([]);
      if (id) void this.loadMessages(id);
    });
  }

  private async loadMessages(id: string) {
    try {
      const msgs = await this.conversationsService.loadMessages(id);
      this.messages.set(msgs.map((m) => ({ role: m.role, content: m.content })));
    } catch {
      // conversation may not exist yet or is empty
    }
    this.scrollToBottom();
  }

  async generate() {
    if (!this.userPrompt.trim() || this.isLoading()) return;

    this.isLoading.set(true);
    const prompt = this.userPrompt.trim();
    this.userPrompt = '';

    this.messages.update((list) => [...list, { role: 'user', content: prompt }]);
    const assistantIdx = this.messages().length;
    this.messages.update((list) => [...list, { role: 'assistant', content: '', loading: true }]);
    this.scrollToBottom();

    try {
      await this.apiService.generateScript(prompt, (text) => {
        this.messages.update((list) => {
          const updated = [...list];
          updated[assistantIdx] = { role: 'assistant', content: text };
          return updated;
        });
        this.scrollToBottom();
      });
    } catch {
      this.messages.update((list) => {
        const updated = [...list];
        updated[assistantIdx] = {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        };
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
