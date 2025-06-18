import { Component, inject } from '@angular/core';

import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileCardComponent } from '../../ui';
import { ProfileService } from '../../data';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  private readonly profileService = inject(ProfileService);
  public profiles = this.profileService.filteredProfiles;
}
