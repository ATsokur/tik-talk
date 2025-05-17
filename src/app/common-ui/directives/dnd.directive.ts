import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dnd]',
  host: {
    '(dragover)': 'onDragOver($event)',
  },
})
export class DndDirective {
  @Output() fileDropped = new EventEmitter<File>();

  @HostBinding('class.fileover')
  fileover: boolean = false;

  @HostBinding('style.borderStyle') get getborderStyle() {
    return this.fileover ? 'solid' : 'dashed';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false;
    this.fileDropped.emit(event.dataTransfer?.files[0]);
  }
}
