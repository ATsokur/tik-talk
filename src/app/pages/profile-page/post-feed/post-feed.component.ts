import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../../data/services/post.service';
import { debounce, debounceTime, firstValueFrom, fromEvent } from 'rxjs';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  private readonly postService = inject(PostService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  public feed = this.postService.posts;

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngAfterViewInit(): void {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => console.log(123));
  }
}
