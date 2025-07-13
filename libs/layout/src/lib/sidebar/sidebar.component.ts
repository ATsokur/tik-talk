import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { firstValueFrom, Subscription, timer } from 'rxjs';

import { Store } from '@ngrx/store';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import {
  ChatsService,
  isErrorMessage,
  profileActions,
  ProfileService,
  selectMe,
  selectSubscribers
} from '@tt/data-access';

import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    NgForOf,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    SubscriberCardComponent,
    AvatarCircleComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  #chatService = inject(ChatsService);
  #store = inject(Store);
  #destroy$ = inject(DestroyRef);
  #profileService = inject(ProfileService);
  public subscribers$ = this.#store.select(selectSubscribers);
  public me = this.#store.selectSignal(selectMe);
  public amountUnreadMessages = inject(ChatsService).amountUnreadMessages;

  public readonly menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
    {
      label: 'Experimental',
      icon: 'experiment',
      link: 'experimental'
    }
  ];

  wsSubscribe!: Subscription;

  //Добавлен profileService для запроса Me
  //когда токен будет протухший
  async reconnectWS() {
    console.log('reconnecting...');
    await firstValueFrom(this.#profileService.getMe());
    await firstValueFrom(timer(2000));
    this.connectWS();
  }

  connectWS() {
    this.wsSubscribe?.unsubscribe();
    this.wsSubscribe = this.#chatService
      .connectWS()
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((message) => {
        if (isErrorMessage(message)) {
          console.log('Неверный токен');
          this.reconnectWS();
        }
      });
  }

  ngOnInit(): void {
    this.#store
      .select(selectMe)
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((me) => {
        if (!me) {
          this.#store.dispatch(profileActions.fetchMe());
        }
      });
    this.#store
      .select(selectSubscribers)
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((subscribers) => {
        if (!subscribers.length) {
          this.#store.dispatch(profileActions.fetchSubscribers({ amount: 7 }));
        }
      });
    this.connectWS();
  }
}
