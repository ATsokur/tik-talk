import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  signal
} from '@angular/core';

import { auditTime, firstValueFrom, fromEvent, Subscription } from 'rxjs';

import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';

import { PostComment, PostService, ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  private resizeSubscription!: Subscription;
  public profile = inject(ProfileService).me;
  public comments = signal<PostComment[]>([]);
  public feed = this.postService.posts;
  public inputType = 'post';

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
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
    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
        communityId: 0
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
