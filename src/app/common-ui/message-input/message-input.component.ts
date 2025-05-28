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
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-message-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule, NgIf],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  private readonly r2 = inject(Renderer2);
  public me = inject(ProfileService).me;
  public avatarUrl = input<string | null>('');

  public inputType = input<string>('');
  public inputText = '';

  @Output() sended = new EventEmitter<string>();

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
