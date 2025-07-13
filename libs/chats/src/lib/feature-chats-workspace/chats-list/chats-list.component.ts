import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  auditTime,
  debounceTime,
  fromEvent,
  map,
  startWith,
  switchMap
} from 'rxjs';

import { ChatsService } from '@tt/data-access';

import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent implements AfterViewInit {
  private readonly chatsService = inject(ChatsService);
  #r2 = inject(Renderer2);
  #destroy$ = inject(DestroyRef);
  @ViewChild('chatsWrap') chatsWrapElement!: ElementRef;
  hostElement = inject(ElementRef);

  public filterChatsControl = new FormControl<string>('');

  public chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map((inputValue) => {
          return chats.filter((chat) => {
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLocaleLowerCase()
              .includes(inputValue!.toLocaleLowerCase());
          });
        }),
        takeUntilDestroyed(this.#destroy$)
      );
    })
  );

  resizeFeed(): void {
    const { top } = this.chatsWrapElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 13 - 12;
    this.#r2.setStyle(
      this.chatsWrapElement.nativeElement,
      'height',
      `${height}px`
    );
  }

  ngAfterViewInit(): void {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(auditTime(300), takeUntilDestroyed(this.#destroy$))
      .subscribe(() => this.resizeFeed());
  }
}
