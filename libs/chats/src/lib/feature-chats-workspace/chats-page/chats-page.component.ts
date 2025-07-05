import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent implements OnInit {
  #chatService = inject(ChatsService);

  ngOnInit(): void {
    this.#chatService.connectWS();
  }
}
