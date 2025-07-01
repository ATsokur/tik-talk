import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { selectFilteredProfiles } from '@tt/data-access';

import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  #store = inject(Store);
  #router = inject(Router);
  public profiles = this.#store.selectSignal(selectFilteredProfiles);

  toChat(userId: number) {
    this.#router.navigate(['chats/', 'new'], { queryParams: { userId } });
  }
}
