import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { auditTime, fromEvent, map, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  postsActions,
  postsFeature,
  selectMe,
  selectPosts
} from '@tt/data-access';

import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  #store = inject(Store);
  private resizeSubscription!: Subscription;
  public profile = this.#store.selectSignal(selectMe);
  public feed = this.#store.selectSignal(selectPosts);
  public inputType = 'post';

  constructor() {
    this.#store
      .select(postsFeature.selectPosts)
      .pipe(
        map((posts) => !posts.length),
        takeUntilDestroyed()
      )
      .subscribe((isEmptyPosts) => {
        if (isEmptyPosts) {
          this.#store.dispatch(postsActions.fetchPosts());
        }
      });
  }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  getPostText(postText: string) {
    this.onCreatePost(postText);
  }

  onCreatePost(postText: string) {
    this.#store.dispatch(
      postsActions.createPost({
        postPayload: {
          title: 'Клевый пост',
          content: postText,
          authorId: this.profile()!.id,
          communityId: 0
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.resizeFeed();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(auditTime(300))
      .subscribe(() => this.resizeFeed());
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
