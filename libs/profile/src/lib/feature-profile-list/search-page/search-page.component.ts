import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileListComponent } from '../profile-list/profile-list.component';

@Component({
  selector: 'app-search-page',
  imports: [ProfileFiltersComponent, ProfileListComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {}
