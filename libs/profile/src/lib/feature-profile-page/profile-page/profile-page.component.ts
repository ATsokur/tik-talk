import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';

import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';

import { PostFeedComponent } from '@tt/posts';
import { ProfileService } from '../../data';
import { ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    PostFeedComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
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
    this.router.navigate(['chats/', 'new'], { queryParams: { userId } });
  }
}
