import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
  private readonly r2 = inject(Renderer2);
  public avatarUrl = input<string | null>('');

  public inputType = input<string>('');
  public inputText = '';

  @Output() sended = new EventEmitter<string>();

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
    if (!this.inputText) return;

    this.sended.emit(this.inputText);
    this.inputText = '';
  }
}
