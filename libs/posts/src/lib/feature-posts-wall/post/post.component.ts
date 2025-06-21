import { Component, inject, input, OnInit, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { CommentComponent } from '../../ui/comment/comment.component';

import {
  AvatarCircleComponent,
  SvgIconComponent,
  TtDatePipe
} from '@tt/common-ui';
import { Post, PostComment, PostService } from '@tt/data-access';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    TtDatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  private readonly postService = inject(PostService);
  public post = input<Post>();
  public comments = signal<PostComment[]>([]);
  public isComments = false;
  public inputType = 'comment';

  isCommentInput() {
    this.isComments = !this.isComments;
  }

  getCommentText(commentText: string) {
    this.onCreateComment(commentText)?.then(async (res) =>
      this.getComments(res.postId)
    );
  }

  onCreateComment(commentText: string) {
    return firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.post()!.author.id,
        postId: this.post()!.id
      })
    );
  }

  async getComments(postId: number) {
    const comments = await firstValueFrom(
      this.postService.getCommentByPostId(postId)
    );
    this.comments.set(comments);
  }

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }
}
