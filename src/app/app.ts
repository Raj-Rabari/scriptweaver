import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Api } from './api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  aiTool = '';
  script: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);

  // Inject the service we created
  private apiService = inject(Api);

  async generate() {
    if (!this.aiTool) return;

    this.isLoading.set(true);
    this.script.set(''); // Clear previous script

    try {
      const contentStream = await this.apiService.generateScript(this.aiTool);
      let content = '';
      for await (const chunk of contentStream.stream) {
        content += chunk.text();
        this.script.set(content);
      }
    } catch (error) {
      this.script.set('Error generating script. Please check your API key or internet connection.');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
