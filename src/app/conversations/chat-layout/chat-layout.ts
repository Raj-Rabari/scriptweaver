import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConversationsService } from '../conversations.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-chat-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './chat-layout.html',
  styleUrls: ['./chat-layout.scss'],
})
export class ChatLayout implements OnInit {
  private conversationsService = inject(ConversationsService);

  ngOnInit() {
    void this.conversationsService.loadConversations();
  }
}
