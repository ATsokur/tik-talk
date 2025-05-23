import {
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import {
  AvatarCircleComponent,
} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {
  SvgIconComponent,
} from '../../../common-ui/svg-icon/svg-icon.component';
import {
  Post,
  PostComment,
} from '../../../data/interfaces/post.interface';
import { TtDatePipe } from '../../../helpers/pipes/tt-date.pipe';
import { PostInput } from '../post-input/interfaces/post-input.interface';
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
export class PostComponent {
  public post = input<Post>();
  public comments = input<PostComment[]>([]);
  public isComments: boolean = false;
  public inputType: string = 'comment';

  @Output() sended = new EventEmitter<PostInput>()

  isCommentInput() {
    this.isComments = !this.isComments;
  }

  receivePostInput(postInput: PostInput) {
    this.sended.emit(postInput);
  }
}
