import { Component, inject, input } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  AvatarCircleComponent,
  SvgIconComponent,
  TtDatePipe
} from '@tt/common-ui';
import { commentsActions, Post, postsFeature } from '@tt/data-access';

import { CommentComponent } from '../../ui/comment/comment.component';
import { PostInputComponent } from '../../ui/post-input/post-input.component';

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
export class PostComponent {
  #store = inject(Store);
  public post = input<Post>();
  public comments = this.#store.selectSignal(postsFeature.selectComments);
  public isComments = false;
  public inputType = 'comment';

  isCommentInput() {
    this.isComments = !this.isComments;
  }

  getCommentText(commentText: string) {
    this.onCreateComment(commentText);
  }

  onCreateComment(commentText: string) {
    return this.#store.dispatch(
      commentsActions.createComment({
        payload: {
          text: commentText,
          authorId: this.post()!.author.id,
          postId: this.post()!.id
        }
      })
    );
  }
}
