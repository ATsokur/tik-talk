import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  constructor() {
    this.#authService.testToken
      .asObservable()
      .pipe(
        filter((token) => !!token),
        tap(() => {
          this.#chatService.wsAdapter.disconnect();
        }),
        switchMap((token) => {
          console.log('TRY token', token);
          return this.#chatService.connectWS(token);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
