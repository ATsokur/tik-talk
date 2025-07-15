import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, of, switchMap } from 'rxjs';

import { ChatsService } from '@tt/data-access';

import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-messages-wrapper.component';

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

  /**
   * Сначала мы обрабатываем id === 'new', а потом при переходе на 40 строчке в chats
   * у нас меняется route params на chat.id, т.к. он изменил, то это значение пошло по потоку
   * и далее будет перехвачено и обработано в switchMap. Так мы сделаем запрос getChatById
   */
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
