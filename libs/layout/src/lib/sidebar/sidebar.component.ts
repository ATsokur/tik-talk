import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { ProfileService } from '@tt/profile';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
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
    AvatarCircleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  public subscribers$ = this.profileService.getSubscribersShortList();
  public me = this.profileService.me;

  public readonly menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
    {
      label: 'Experimental',
      icon: 'experiment',
      link: 'experimental',
    },
  ];

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe());
  }
}
