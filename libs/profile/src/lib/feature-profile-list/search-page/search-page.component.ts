import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileListComponent } from '../profile-list/profile-list.component';
import { Store } from '@ngrx/store';
import { profileActions } from '@tt/data-access';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileFiltersComponent,
    ProfileListComponent,
    InfiniteScrollDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  #store = inject(Store);

  onScroll() {
    this.timeToFetch();
  }

  timeToFetch() {
    this.#store.dispatch(profileActions.setPage({}));
  }
}
