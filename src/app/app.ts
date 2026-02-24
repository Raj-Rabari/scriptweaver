import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Api } from './api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

interface ConversationItem {
  prompt: string;
  response: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  userPrompt = '';
  isLoading: WritableSignal<boolean> = signal(false);
  conversations: WritableSignal<ConversationItem[]> = signal([]);

  // Inject the service we created
  private apiService = inject(Api);

  async generate() {
    if (!this.userPrompt) return;

    this.isLoading.set(true);
    const prompt = this.userPrompt;
    this.userPrompt = ''; // Clear input
    let fullResponse = '';

    try {
      await this.apiService.generateScript(prompt, (script) => {
        fullResponse = script;
      });

      // Add to conversation history
      const conversations = this.conversations();
      conversations.push({
        prompt,
        response: fullResponse,
      });
      this.conversations.set([...conversations]);
    } catch (error) {
      console.error(error);
      const conversations = this.conversations();
      conversations.push({
        prompt,
        response: 'Something went wrong while generating the content. Please try again later.',
      });
      this.conversations.set([...conversations]);
    } finally {
      this.isLoading.set(false);
    }
  }

  getHtmlContent(markdown: string): SafeHtml {
    return marked.parse(markdown);
  }
}
