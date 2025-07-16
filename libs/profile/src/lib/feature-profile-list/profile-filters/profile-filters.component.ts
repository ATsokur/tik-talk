import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  debounceTime,
  startWith,
  Subscription,
  switchMap,
  take,
  tap
} from 'rxjs';

import { Store } from '@ngrx/store';
import { profileActions, selectFilteredProfiles } from '@tt/data-access';

@Component({
  selector: 'app-profile-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  public searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  });
  #store = inject(Store);

  private searchFormSub!: Subscription;

  constructor() {
    this.searchFormSub = this.#store
      .select(selectFilteredProfiles)
      .pipe(
        take(1),
        tap(({ filters }) => {
          this.searchForm.patchValue(filters);
        }),
        switchMap(({ filters }) => {
          const isEmptyFilters = !Object.values(filters).length;
          if (isEmptyFilters) {
            return this.searchForm.valueChanges.pipe(
              startWith(filters),
              debounceTime(300)
            );
          }
          return this.searchForm.valueChanges.pipe(debounceTime(300));
        })
      )
      .subscribe((formValue) => {
        this.#store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });
  }

  ngOnDestroy(): void {
    this.searchFormSub.unsubscribe();
  }
}
