import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConversationsService } from '../conversations.service';
import { Sidebar } from '../sidebar/sidebar';

interface LegacyItem {
  prompt: string;
  response: string;
}

const LEGACY_KEY = 'scriptweaver_conversations';

@Component({
  selector: 'app-chat-layout',
  imports: [RouterOutlet, Sidebar, CommonModule],
  templateUrl: './chat-layout.html',
  styleUrls: ['./chat-layout.scss'],
})
export class ChatLayout implements OnInit {
  private conversationsService = inject(ConversationsService);
  private router = inject(Router);

  showImportBanner = signal(false);
  importing = signal(false);
  importError = signal<string | null>(null);

  private legacyItems: LegacyItem[] = [];

  ngOnInit() {
    void this.conversationsService.loadConversations();
    this.checkLegacyData();
  }

  private checkLegacyData() {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.legacyItems = (parsed as LegacyItem[]).slice(0, 25);
        this.showImportBanner.set(true);
      } else {
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch {
      localStorage.removeItem(LEGACY_KEY);
    }
  }

  get importCount(): number {
    return this.legacyItems.length;
  }

  async importChats() {
    if (this.importing()) return;
    this.importing.set(true);
    this.importError.set(null);
    try {
      const conv = await this.conversationsService.importLocalStorage(this.legacyItems);
      localStorage.removeItem(LEGACY_KEY);
      this.showImportBanner.set(false);
      await this.router.navigate(['/c', conv.id]);
    } catch {
      this.importError.set('Import failed. Please try again.');
    } finally {
      this.importing.set(false);
    }
  }

  skipImport() {
    localStorage.removeItem(LEGACY_KEY);
    this.showImportBanner.set(false);
  }
}
