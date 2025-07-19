import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import {
  profileActions,
  selectFilteredProfiles,
  selectMe,
  selectMySubscriptions
} from '@tt/data-access';

import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCardComponent,
    ProfileFiltersComponent,
    InfiniteScrollDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  #store = inject(Store);
  #router = inject(Router);
  #destroy$ = inject(DestroyRef);
  profiles = this.#store.selectSignal(selectFilteredProfiles);
  me = this.#store.selectSignal(selectMe);

  toChat(userId: number) {
    this.#router.navigate(['chats/', 'new'], { queryParams: { userId } });
  }

  toSubscribe(accountId: number) {
    this.#store.dispatch(profileActions.toSubscribe({ accountId }));
  }

  toUnsubscribe(accountId: number) {
    this.#store.dispatch(profileActions.toUnsubscribe({ accountId }));
  }

  timeToFetch() {
    this.#store.dispatch(profileActions.setPage({}));
  }

  onScroll() {
    this.timeToFetch();
  }

  onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return;

    if (entries[0].intersectionRatio > 0) {
      this.timeToFetch();
    }
  }

  ngOnInit(): void {
    this.#store
      .select(selectMySubscriptions)
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((mySubscriptions) => {
        if (!mySubscriptions.length) {
          this.#store.dispatch(profileActions.fetchMySubscriptions());
        }
      });
  }
}
