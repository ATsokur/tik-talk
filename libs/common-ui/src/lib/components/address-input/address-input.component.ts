import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';

import { debounceTime, map, switchMap, tap } from 'rxjs';

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
  placeholder = input.required<string>();
  divider = '\n';

  suggestion$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(2000),
    switchMap((address) => {
      return this.#dadataService.getSuggestionCities(address).pipe(
        map((suggestions) => {
          return suggestions.map((suggestion) => {
            if (!suggestion) return '\n';
            return suggestion;
          });
        }),
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
    const patchAddress = address.split(this.divider).join(' ');
    this.innerSearchControl.patchValue(patchAddress, {
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
