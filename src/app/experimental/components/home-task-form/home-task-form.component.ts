import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { HomeTaskFormMockService } from '../../services/home-task-form.mock.service';

@Component({
  selector: 'app-home-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './home-task-form.component.html',
  styleUrl: './home-task-form.component.scss',
  providers: [HomeTaskFormMockService],
})
export class HomeTaskFormComponent {
  emailPlaceholder: string =
    'Email подтянется автоматически при выборе сотрудника';
  #homeTaskFormMockService = inject(HomeTaskFormMockService);
  employees = this.#homeTaskFormMockService.employees;
  departments = this.#homeTaskFormMockService.departments;
  employeesFullNames = computed<string[]>(() => {
    return this.employees().map(({ firstName, lastName, secondName }) => {
      return `${secondName} ${firstName} ${lastName}`;
    });
  });
  emails = computed<string[]>(() => {
    return this.employees().map(({ email }) => email);
  });

  services = this.#homeTaskFormMockService.services;
  servicesName = computed<string[]>(() => {
    return this.services().map(({ serviceName }) => {
      return serviceName;
    });
  });

  compoundServices = this.#homeTaskFormMockService.compoundServices;

  form = new FormGroup({
    employee: new FormControl<string>('', [Validators.required]),
    phoneNumber: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    email: new FormControl<string>({ value: '', disabled: true }),
    department: new FormControl<string | null>(null, [Validators.required]),
    requestDescription: new FormControl<string>('', [Validators.required]),
    services: new FormControl<string | null>('--Выберете услугу--', [
      Validators.required,
    ]),
    compoundServices: new FormControl<string | null>(
      '--Выберете состав услуги--',
      [Validators.required]
    ),
  });

  constructor() {
    this.#homeTaskFormMockService
      .getDepartments()
      .pipe(takeUntilDestroyed())
      .subscribe();

    this.#homeTaskFormMockService
      .getEmployees()
      .pipe(takeUntilDestroyed())
      .subscribe();

    this.#homeTaskFormMockService
      .getSectionServices()
      .pipe(takeUntilDestroyed())
      .subscribe();

    this.form.controls.employee.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((fullName) => {
        if (!fullName) {
          this.form.controls.email.patchValue(this.emailPlaceholder, {
            emitEvent: false,
          });
        }

        const name = fullName?.split(' ').join('').toLocaleLowerCase();
        let employeeName;
        this.employees().forEach(
          ({ firstName, lastName, secondName, email }) => {
            employeeName =
              `${secondName}${firstName}${lastName}`.toLocaleLowerCase();
            if (name === employeeName) {
              this.form.controls.email.patchValue(email, { emitEvent: false });
            }
          }
        );
      });
    this.form.controls.services.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((service) => {
        this.services().forEach(({ serviceName, compoundServices }) => {
          if (service === serviceName) {
            this.compoundServices.set(compoundServices);
          }
        });

        this.form.controls.compoundServices.patchValue(
          this.compoundServices()[0],
          {
            emitEvent: false,
          }
        );
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.value);
  }
}
