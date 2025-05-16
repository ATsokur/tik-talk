import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective, AsyncPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  private readonly profileService = inject(ProfileService);
  public preview = signal<string>('');

  public me$ = toObservable(this.profileService.me).pipe(
    tap((profile) => {
      profile?.avatarUrl
        ? this.preview.set(
            `https://icherniakov.ru/yt-course/${profile.avatarUrl}`
          )
        : this.preview.set('/assets/img/avatar-placeholder.png');
    })
  );

  public avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
