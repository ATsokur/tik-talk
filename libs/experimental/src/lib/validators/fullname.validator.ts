import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from '@angular/forms';
import { HomeTaskFormMockService } from '@tt/data-access';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateFullName implements AsyncValidator {
  #homeTaskFormMockService = inject(HomeTaskFormMockService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.#homeTaskFormMockService.getEmployees().pipe(
      map((employees) => {
        return !employees
          .map(({ firstName, secondName, lastName }) => {
            return `${secondName} ${firstName} ${lastName}`;
          })
          .includes(control.value)
          ? { employee: { message: 'Некорректное ФИО сотрудника' } }
          : null;
      })
    );
  }
}
