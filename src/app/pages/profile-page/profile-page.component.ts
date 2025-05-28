import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { firstValueFrom, switchMap } from 'rxjs';

import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../data/services/profile.service';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { ChatsService } from '../../data/services/chats.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private readonly chatService = inject(ChatsService);
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public me$ = toObservable(this.profileService.me);
  public subscribers$ = this.profileService.getSubscribersShortList(7);
  public isMyPage = signal<boolean>(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    await firstValueFrom(this.chatService.createChat(userId)).then((res) =>
      this.router.navigate([`chats/${res.id}`])
    );
  }
}
