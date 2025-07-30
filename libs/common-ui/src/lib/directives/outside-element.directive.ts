import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[ttOutsideEl]',
  host: {
    '(window:click)': 'onClick($event)',
    '(window:keyup)': 'onTab($event)'
  }
})
export class OutsideElementDirective {
  #hostElement = inject(ElementRef);
  outsided = output<MouseEvent | KeyboardEvent>();

  onClick(event: MouseEvent) {
    if (!this.#hostElement.nativeElement.contains(event.target)) {
      this.outsided.emit(event);
    }
  }

  onTab(event: KeyboardEvent) {
    if (!this.#hostElement.nativeElement.contains(event.target)) {
      this.outsided.emit(event);
    }
  }
}
