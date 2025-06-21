import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import {
  AvatarCircleComponent,
  DndDirective,
  SvgIconComponent
} from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective, AsyncPipe, AvatarCircleComponent],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  private readonly profileService = inject(ProfileService);
  public preview = signal<string>('');

  public me$ = toObservable(this.profileService.me).pipe(
    tap((profile) => {
      profile?.avatarUrl
        ? this.preview.set(profile.avatarUrl)
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
