import { Component, input } from '@angular/core';
import { PostComment } from '../../data';
import { AvatarCircleComponent, TtDatePipe } from '@tt/common-ui';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  public comment = input<PostComment>();
}
