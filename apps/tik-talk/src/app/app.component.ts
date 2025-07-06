import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { filter, switchMap, tap } from 'rxjs';

import { AuthService, ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  #chatService = inject(ChatsService);
  #authService = inject(AuthService);

  //TODO Сделать функцию reconnect. Если будут проблемы вынести всю
  //TODO логику из app в sidebar

  reconnect() {
    //refresh token
    //ждать refresh
    //подключается заново
  }

  constructor() {
    toObservable(this.#authService.token)
      .pipe(
        filter((token) => !!token),
        tap(() => {
          this.#chatService.wsAdapter.disconnect();
        }),
        switchMap((token) => {
          return this.#chatService.connectWS(token);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
