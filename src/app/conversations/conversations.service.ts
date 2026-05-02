import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  archived: boolean;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  truncated: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/conversations`;

  conversations = signal<Conversation[]>([]);
  loading = signal(false);

  async loadConversations(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.get<{ conversations: Conversation[]; nextCursor: string | null }>(this.base),
      );
      this.conversations.set(res.conversations);
    } finally {
      this.loading.set(false);
    }
  }

  async createConversation(title?: string): Promise<Conversation> {
    const res = await firstValueFrom(
      this.http.post<{ conversation: Conversation }>(this.base, title ? { title } : {}),
    );
    this.conversations.update((list) => [res.conversation, ...list]);
    return res.conversation;
  }

  async deleteConversation(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this.conversations.update((list) => list.filter((c) => c.id !== id));
  }

  async updateTitle(id: string, title: string): Promise<Conversation> {
    const res = await firstValueFrom(
      this.http.patch<{ conversation: Conversation }>(`${this.base}/${id}`, { title }),
    );
    this.conversations.update((list) => list.map((c) => (c.id === id ? res.conversation : c)));
    return res.conversation;
  }

  async loadMessages(conversationId: string): Promise<Message[]> {
    const res = await firstValueFrom(
      this.http.get<{ messages: Message[]; nextBefore: string | null }>(
        `${this.base}/${conversationId}/messages`,
      ),
    );
    return res.messages;
  }

  async archiveConversation(id: string): Promise<void> {
    await firstValueFrom(this.http.patch(`${this.base}/${id}`, { archived: true }));
    this.conversations.update((list) => list.filter((c) => c.id !== id));
  }

  sendMessage(
    conversationId: string,
    content: string,
    onProgress: (text: string) => void,
  ): Promise<void> {
    const isFirstExchange =
      (this.conversations().find((c) => c.id === conversationId)?.messageCount ?? 0) === 0;

    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.base}/${conversationId}/messages`, { content }, {
          observe: 'events',
          reportProgress: true,
          responseType: 'text',
        })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.DownloadProgress) {
              const partial = (event as HttpDownloadProgressEvent).partialText;
              if (partial) onProgress(partial);
            } else if (event.type === HttpEventType.Response) {
              // Immediate optimistic update for counters
              this.conversations.update((list) =>
                list.map((c) =>
                  c.id === conversationId
                    ? {
                        ...c,
                        messageCount: c.messageCount + 2,
                        lastMessageAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }
                    : c,
                ),
              );
              // Delayed re-fetch to pick up async server changes (title autogen on first exchange)
              const delay = isFirstExchange ? 2000 : 0;
              if (delay > 0) {
                setTimeout(() => {
                  firstValueFrom(
                    this.http.get<{ conversation: Conversation }>(`${this.base}/${conversationId}`),
                  )
                    .then((res) => {
                      this.conversations.update((list) =>
                        list.map((c) => (c.id === conversationId ? res.conversation : c)),
                      );
                    })
                    .catch(() => {/* best-effort */});
                }, delay);
              }
              resolve();
            }
          },
          error: (err: unknown) => reject(err),
        });
    });
  }
}
