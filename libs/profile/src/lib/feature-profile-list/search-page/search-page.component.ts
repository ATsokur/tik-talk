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
  selectMySubscriptions
} from '@tt/data-access';

import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';
import { WaIntersectionObserver } from '@ng-web-apis/intersection-observer';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCardComponent,
    ProfileFiltersComponent,
    InfiniteScrollTriggerComponent,
    WaIntersectionObserver
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  #store = inject(Store);
  #router = inject(Router);
  #destroy$ = inject(DestroyRef);
  public profiles = this.#store.selectSignal(selectFilteredProfiles);

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

  onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return;

    if (entries[0].intersectionRatio > 0) {
      this.timeToFetch();
    }
    console.log(entries);
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
