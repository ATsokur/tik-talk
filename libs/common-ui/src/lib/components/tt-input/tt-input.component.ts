import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  inject,
  input,
  output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'tt-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent)
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {
  #cdr = inject(ChangeDetectorRef);
  type = input<'text' | 'password'>('text');
  placeholder = input<string>();
  #disabled = false;
  blurred = output<void>();

  ttInputControl = new FormControl();

  onChange: any;
  onTouched: any;

  @HostBinding('class.disabled')
  get disabled() {
    return this.#disabled;
  }

  constructor() {
    this.ttInputControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => this.onChange(val));
  }

  onBlur() {
    this.blurred.emit();
    this.onTouched();
  }

  writeValue(val: any): void {
    this.ttInputControl.patchValue(val, {
      emitEvent: false
    });
    this.#cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.#disabled = isDisabled;
    if (isDisabled) {
      this.ttInputControl.disable();
    }
  }
}
