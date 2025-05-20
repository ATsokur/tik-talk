import {
  Component,
  input,
} from '@angular/core';

import {
  AvatarCircleComponent,
} from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { TtDatePipe } from '../../../../helpers/pipes/tt-date.pipe';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  public comment = input<PostComment>();
}
