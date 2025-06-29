import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Store } from '@ngrx/store';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { selectMe, selectSubscribers } from '@tt/data-access';

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
export class SidebarComponent {
  #store = inject(Store);
  public subscribers$ = this.#store.select(selectSubscribers);
  public me = this.#store.selectSignal(selectMe);

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
}
