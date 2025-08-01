import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';

import { ValidateFullName, validatePhoneNumber } from '../../validators';
import { MaskitoOptions } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import phoneMask from './phone-mask';
import {
  Appeal,
  CurrentCompounds,
  HomeTaskFormMockService,
  Option
} from '@tt/data-access';

function addAppealForm(): FormGroup<Appeal> {
  return new FormGroup<Appeal>({
    assistance: new FormControl<string | null>(null, [Validators.required]),
    compound: new FormControl<string | null>(null, [Validators.required]),
    requestDescription: new FormControl<string>('', [Validators.required])
  });
}

@Component({
  selector: 'app-home-task-form',
  imports: [ReactiveFormsModule, MaskitoDirective],
  templateUrl: './home-task-form.component.html',
  styleUrl: './home-task-form.component.scss',
  providers: [HomeTaskFormMockService, ValidateFullName],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTaskFormComponent implements AfterViewInit {
  #hostElement = inject(ElementRef);
  #r2 = inject(Renderer2);
  #validateEmployee = inject(ValidateFullName);
  #homeTaskFormMockService = inject(HomeTaskFormMockService);
  #destroyRef = inject(DestroyRef);
  emailPlaceholder = 'Email появится автоматически при выборе сотрудника';
  employees = this.#homeTaskFormMockService.employees;
  departments = this.#homeTaskFormMockService.departments;
  employeesFullNames = computed<string[]>(() => {
    return this.employees().map(({ firstName, lastName, secondName }) => {
      return `${secondName} ${firstName} ${lastName}`;
    });
  });
  assistances = this.#homeTaskFormMockService.assistances;
  compounds = this.#homeTaskFormMockService.compoundAssistances;
  currentCompounds = signal<CurrentCompounds>({});
  currentCompoundsOptions = computed<Option[][]>(() => {
    return Object.values(this.currentCompounds());
  });
  assistancesObservables: Observable<string | null>[] = [];
  assistancesSubscriptions: Subscription[] = [];
  readonly maskitoPhoneOptions: MaskitoOptions = phoneMask;

  form = new FormGroup({
    employee: new FormControl<string>(
      '',
      Validators.required,
      this.#validateEmployee.validate.bind(this.#validateEmployee)
    ),
    phoneNumber: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      validatePhoneNumber('+7 9')
    ]),
    email: new FormControl<string>({ value: '', disabled: true }),
    department: new FormControl<string | null>('', Validators.required),
    appeals: new FormArray<FormGroup<Appeal>>([])
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
      .getSectionAssistances()
      .pipe(takeUntilDestroyed())
      .subscribe();

    this.form.controls.employee.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((fullName) => {
        if (!fullName) {
          this.form.controls.email.patchValue(this.emailPlaceholder, {
            emitEvent: false
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
              this.form.controls.email.markAsDirty();
            }
          }
        );
      });
  }

  updateCurrentCompounds(index: number, chooseAssistance: string | null) {
    this.assistances().forEach(({ type, compounds }) => {
      if (chooseAssistance === type.value) {
        this.currentCompounds.update((value) => {
          value[index] = compounds;
          return { ...value };
        });
      }
    });
    this.form.controls.appeals.controls[index].controls.compound.patchValue(
      this.currentCompounds()[index][0].value,
      {
        emitEvent: false
      }
    );
  }

  addZeroCompound(index: number) {
    this.currentCompounds.update((value) => {
      value[index] = [this.compounds()[0][0]];
      return { ...value };
    });
  }

  toUnsubscribeAssistanceControl(index: number) {
    this.assistancesSubscriptions.forEach((sub, i) => {
      if (i >= index) sub.unsubscribe();
    });
    this.assistancesSubscriptions.splice(index);
  }

  //После удаления формы из appeals обновляем key и value в currentCompounds
  updateCompoundsAfterDeleteAppeal(index: number) {
    const currentCompounds = this.currentCompounds();
    const formPositions: string[] = Object.keys(currentCompounds);
    let isDeletedCompound = false;
    formPositions.forEach((pos) => {
      const numPos = Number(pos);
      if (index === numPos) {
        delete currentCompounds[numPos];
        isDeletedCompound = true;
        return;
      }

      if (isDeletedCompound) {
        currentCompounds[numPos - 1] = currentCompounds[numPos];
        delete currentCompounds[numPos];
      }
    });
    this.currentCompounds.set({ ...currentCompounds });
  }

  //Заполняю assistanceObservables новыми assistance.valueChanges и подписываюсь на них + заполняю subscriptions
  addSubsOnAssistance() {
    this.form.controls.appeals.controls.forEach((formGroup, i) => {
      if (!this.assistancesObservables[i]) {
        this.assistancesObservables.push(
          formGroup.controls.assistance.valueChanges
        );
        this.addAssistancesSubscriptions(i);
      }
    });
  }

  addAssistancesObservables(index: number) {
    this.assistancesObservables.push(
      this.form.controls.appeals.controls[index].controls.assistance
        .valueChanges
    );
  }

  addAssistancesSubscriptions(index: number) {
    const subscription = this.assistancesObservables[index]
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((chooseAssistance) => {
        this.updateCurrentCompounds(index, chooseAssistance);
      });
    this.assistancesSubscriptions.push(subscription);
  }

  addAppeal() {
    const formPosition: number = this.form.controls.appeals.length;
    this.form.controls.appeals.insert(formPosition, addAppealForm());
    this.addZeroCompound(formPosition);
    this.addAssistancesObservables(formPosition);
    this.addAssistancesSubscriptions(formPosition);
  }

  //Удаление работает на конкретную форму, которую мы хотим удалить
  deleteAppeal(index: number) {
    this.updateCompoundsAfterDeleteAppeal(index);
    this.form.controls.appeals.removeAt(index);
    this.assistancesObservables.splice(index);
    this.toUnsubscribeAssistanceControl(index);
    this.addSubsOnAssistance();
  }

  onMaskEmployee(event: KeyboardEvent) {
    const char = event.key;
    const isString = /(?!^.*[А-Я]{2,}.*$)^[А-Яа-я]*$/.test(char);
    if (
      !isString &&
      char !== 'Backspace' &&
      char !== 'Delete' &&
      char !== ' ' &&
      char !== 'Shift'
    ) {
      event.preventDefault();
    }
  }

  /**
   * До переезда на Maskito
   * @param event
   */
  // onMaskPhoneNumber(event: KeyboardEvent) {
  //   const input = event.target as HTMLInputElement;
  //   const value = input.value;
  //   const char = event.key;
  //   const isNumber = /^[0-9]$/.test(char);
  //   const separators = [' ', '-'];

  //   if (!value.startsWith('+7')) {
  //     input.value = '+7';
  //   }

  //   if (value[2] !== separators[0]) {
  //     input.value = '+7' + separators[0];
  //   }

  //   if (
  //     value.length === 6 &&
  //     event.key !== 'Backspace' &&
  //     event.key !== 'Delete'
  //   ) {
  //     input.value = input.value + separators[0];
  //   }

  //   if (
  //     (value.length === 10 &&
  //       event.key !== 'Backspace' &&
  //       event.key !== 'Delete') ||
  //     (value.length === 13 &&
  //       event.key !== 'Backspace' &&
  //       event.key !== 'Delete')
  //   ) {
  //     input.value = input.value + separators[1];
  //   }

  //   if (!isNumber && event.key !== 'Backspace' && event.key !== 'Delete') {
  //     event.preventDefault();
  //   }

  //   if (value.length <= 2 && char === 'Backspace') {
  //     event.preventDefault();
  //   }

  //   if (value.length > 15 && char !== 'Backspace' && char !== 'Delete') {
  //     event.preventDefault();
  //   }
  // }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.getRawValue());
  }

  resizeForm() {
    const { top } = this.#hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 36 - 36;
    this.#r2.setStyle(this.#hostElement.nativeElement, 'height', `${height}px`);
  }

  ngAfterViewInit() {
    this.resizeForm();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.resizeForm());
  }
}
