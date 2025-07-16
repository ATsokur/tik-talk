import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarCircleComponent, TtDatePipe } from '@tt/common-ui';
import { PostComment } from '@tt/data-access';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  public comment = input<PostComment>();
}
