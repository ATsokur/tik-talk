import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
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
