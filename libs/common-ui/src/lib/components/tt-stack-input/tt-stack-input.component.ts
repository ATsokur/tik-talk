import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'tt-stack-input',
  imports: [CommonModule, FormsModule, SvgIconComponent],
  templateUrl: './tt-stack-input.component.html',
  styleUrl: './tt-stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtStackInputComponent)
    }
  ]
})
export class TtStackInputComponent implements ControlValueAccessor {
  stack$ = new BehaviorSubject<string[]>([]);

  innerInput: string | null = null;

  isDisabled = signal<boolean>(false);

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.innerInput) return;

    this.stack$.next([...this.stack$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.stack$.value);
  }

  @HostBinding('class.disabled')
  get disabled() {
    return this.isDisabled();
  }

  onDeleteTag(i: number) {
    const tags = this.stack$.value;
    tags.splice(i, 1);

    this.stack$.next(tags);
    this.onChange(this.stack$.value);
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.stack$.next([]);
      return;
    }

    this.stack$.next([...stack]);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChange(value: string[] | null) {}

  onTouch() {}
}
