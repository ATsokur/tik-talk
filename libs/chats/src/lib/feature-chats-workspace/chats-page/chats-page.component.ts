import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { ChatsService } from '@tt/data-access';

import { ChatsListComponent } from '../chats-list/chats-list.component';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {
  #chatService = inject(ChatsService);

  constructor() {
    this.#chatService.connectWS().pipe(takeUntilDestroyed()).subscribe();
  }
}
