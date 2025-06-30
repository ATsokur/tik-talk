import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import {
  profileActions,
  selectAccount,
  selectMe,
  selectSubscribers
} from '@tt/data-access';
import { PostFeedComponent } from '@tt/posts';

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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  #store = inject(Store);
  public me$ = this.#store.select(selectMe);
  public subscribers$ = this.#store.select(selectSubscribers);
  public isMyPage = signal<boolean>(false);
  public isProfilePage = signal<boolean>(true);

  profile$ = this.route.params.pipe(
    tap(({ id }) => {
      this.isMyPage.set(id && id === 'me');
    }),
    switchMap(({ id }) => {
      if (id === 'me') return this.me$;
      this.#store.dispatch(profileActions.fetchAccount({ id }));
      return this.#store.select(selectAccount);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['chats/', 'new'], { queryParams: { userId } });
  }
}
