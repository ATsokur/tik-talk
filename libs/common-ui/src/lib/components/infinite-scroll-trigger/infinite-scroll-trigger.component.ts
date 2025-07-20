import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-infinite-scroll-trigger',
  imports: [CommonModule],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollTriggerComponent implements OnInit {
  loaded = output<void>();

  ngOnInit(): void {
    this.loaded.emit();
  }
}
