import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
  signal,
} from '@angular/core';

import {
  debounceTime,
  firstValueFrom,
  fromEvent,
} from 'rxjs';

import { PostService } from '../../../data/services/post.service';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { ProfileService } from '../../../data/services/profile.service';
import { PostInput } from '../post-input/interfaces/post-input.interface';
import { PostComment } from '../../../data/interfaces/post.interface';

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
  public profile = inject(ProfileService).me;
  public comments = signal<PostComment[]>([])
  public feed = this.postService.posts;
  public inputType: string = 'post';


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

  receivePostInput(postInput: PostInput) {
    if (postInput.type === 'post') {
      this.onCreatePost(postInput.text);
    }

    if (postInput.type === 'comment') {
      console.log('post-feed создал коммент');
      this.onCreateComment(postInput.text, postInput.id)
        ?.then(() => firstValueFrom(this.postService.fetchPosts()));
    }
  }

  onCreatePost(postText: string) {
    if (!postText) return;

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
        communityId: 0,
      })
    )
  }

  onCreateComment(commentText: string, postId: number) {
    if (!commentText) return;

    return firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: postId,
      })
    )
  }

  async getComments(postId: number) {
    const comments = await firstValueFrom(
      this.postService.getCommentByPostId(postId)
    );
    this.comments.set(comments);
  }

  ngAfterViewInit(): void {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe();
  }
}
