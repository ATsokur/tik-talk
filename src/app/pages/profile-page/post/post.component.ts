import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';

import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostComment, Post } from '../../../data/interfaces/post.interface';
import { PostInputComponent } from '../post-input/post-input.component';
import { CommentComponent } from './comment/comment.component';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    DatePipe,
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
  public isComment: boolean = false;

  isCommentInput() {
    this.isComment = !this.isComment;
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }
}
