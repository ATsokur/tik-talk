import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Feature, FormExperimentalMockService } from '@tt/data-access';

interface InitialValue {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

export enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL'
}

function getAddresses(initialValue: InitialValue = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null)
  });
}

@Component({
  selector: 'app-form-experimental',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './form-experimental.component.html',
  styleUrl: './form-experimental.component.scss',
  providers: [FormExperimentalMockService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormExperimentalComponent {
  ReceiverType = ReceiverType;
  initialValue: InitialValue = {
    // city: 'Kdqw',
    // street: 'dwqdqw',
    building: 1231,
    apartment: 2313
  };

  features: Feature[] = [];

  #formExperimentalMockService = inject(
    FormExperimentalMockService
  ).getFeatures();

  form = new FormGroup({
    type: new FormControl<ReceiverType>(this.ReceiverType.PERSON),
    name: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    inn: new FormControl<string>(''),
    addresses: new FormArray([getAddresses()]),
    feature: new FormRecord({})
  });

  constructor() {
    // this.form.controls.addresses.clear();
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        if (val === this.ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]);
        }
      });

    this.#formExperimentalMockService
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }

        // console.log(this.form.controls.feature);
      });

    // this.form.controls.name.patchValue('Ann');
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.value);

    // this.form.controls.addresses.patchValue([this.initialValue], {
    //   emitEvent: false,
    // });
    // this.form.controls.addresses.controls[1].patchValue({
    //   street: 'blaaa',
    // });
    // this.form.controls.addresses.controls[1].controls.street.disable();
  }

  addAddresses() {
    this.form.controls.addresses.insert(0, getAddresses());
  }

  deleteAddresses(index: number) {
    this.form.controls.addresses.removeAt(index);
  }

  sort = () => 0;
}
