import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AvatarCircleComponent,
} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {
  SvgIconComponent,
} from '../../../common-ui/svg-icon/svg-icon.component';
import { PostInput } from './interfaces/post-input.interface';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  private readonly r2 = inject(Renderer2);
  public avatarUrl = input<string | null>('');
  public postId = input<number>(0);

  public inputType = input<string>('');
  public inputText = '';


  @Output() sended = new EventEmitter<PostInput>();

  @HostBinding('class.comment')
  get isComment() {
    return this.inputType() === 'comment';
  }

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', '21px');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSend() {
    this.sended.emit({
      type: this.inputType(),
      text: this.inputText,
      id: this.postId()
    })
    this.inputText = '';
  }
}
