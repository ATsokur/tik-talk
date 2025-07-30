import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';

import { debounceTime, switchMap, tap } from 'rxjs';

import { DadataService } from '@tt/data-access';

import { OutsideElementDirective } from '../../directives';
import { TtInputComponent } from '../tt-input/tt-input.component';

@Component({
  selector: 'tt-address-input',
  imports: [
    CommonModule,
    TtInputComponent,
    ReactiveFormsModule,
    OutsideElementDirective
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent)
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  #dadataService = inject(DadataService);
  innerSearchControl = new FormControl();
  isDropdownOpened = signal<boolean>(false);

  suggestion$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((address) => {
      return this.#dadataService
        .getSuggestion(address)
        .pipe(
          tap((suggestions) => this.isDropdownOpened.set(!!suggestions.length))
        );
    })
  );

  onBlur() {
    this.onTouched();
  }

  onOutside() {
    this.isDropdownOpened.set(false);
  }

  toChooseAddress(address: string) {
    this.innerSearchControl.patchValue(address, {
      emitEvent: false
    });
    this.onChange(address);
    this.isDropdownOpened.set(false);
  }

  writeValue(address: string | null): void {
    this.innerSearchControl.patchValue(address, {
      emitEvent: false
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerSearchControl.disable();
    }
  }

  onChange(value: any) {}

  onTouched() {}
}
