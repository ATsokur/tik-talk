import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  profileActions,
  selectFilteredProfiles,
  selectMe,
  selectMySubscriptions
} from '@tt/data-access';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';

@Component({
  selector: 'tt-profile-list',
  imports: [CommonModule, ProfileCardComponent, InfiniteScrollTriggerComponent],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileListComponent implements OnInit {
  #store = inject(Store);
  #router = inject(Router);
  #destroy$ = inject(DestroyRef);
  profiles = this.#store.selectSignal(selectFilteredProfiles);
  me = this.#store.selectSignal(selectMe);
  loaded = output<void>();

  toLoaded() {
    this.loaded.emit();
  }

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
