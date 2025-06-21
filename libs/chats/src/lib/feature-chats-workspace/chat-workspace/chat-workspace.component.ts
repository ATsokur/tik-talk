import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, of, switchMap } from 'rxjs';

import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-messages-wrapper.component';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatMessagesWrapperComponent,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  #router = inject(Router);
  private readonly chatsService = inject(ChatsService);

  public activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.route.queryParamMap.pipe(
          filter((params) => params.has('userId')),
          switchMap((params) => {
            const userId = Number(params.get('userId'));
            return this.chatsService.createChat(userId).pipe(
              switchMap((chat) => {
                this.#router.navigate(['chats', chat.id]);
                return of(null);
              })
            );
          })
        );
      }
      return this.chatsService.getChatById(id);
    })
  );
}
