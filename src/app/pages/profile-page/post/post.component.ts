import { Component, inject, input, OnInit, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { Post, PostComment } from '../../../data/interfaces/post.interface';
import { PostService } from '../../../data/services/post.service';
import { TtDatePipe } from '../../../helpers/pipes/tt-date.pipe';
import { PostInputComponent } from '../post-input/post-input.component';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    TtDatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  private readonly postService = inject(PostService);
  public post = input<Post>();
  public comments = signal<PostComment[]>([]);
  public isComments: boolean = false;
  public inputType: string = 'comment';

  isCommentInput() {
    this.isComments = !this.isComments;
  }

  getCommentText(commentText: string) {
    this.onCreateComment(commentText)?.then(async (res) =>
      this.getComments(res.postId)
    );
  }

  onCreateComment(commentText: string) {
    if (!commentText) return;

    return firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.post()!.author.id,
        postId: this.post()!.id,
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
