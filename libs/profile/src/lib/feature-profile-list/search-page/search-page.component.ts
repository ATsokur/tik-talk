import { Component, inject } from '@angular/core';

import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileCardComponent } from '../../ui';
import { selectFilteredProfiles } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  #store = inject(Store);
  public profiles = this.#store.selectSignal(selectFilteredProfiles);
}
