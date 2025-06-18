import {
  Component,
  DestroyRef,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { exhaustMap, firstValueFrom, tap } from 'rxjs';

import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { ProfileService } from '../../data';

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  public profile = this.profileService.me;

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  public form = this.fb.group({
    firstName: [
      '',
      {
        validators: [Validators.required],
      },
    ],
    lastName: [''],
    username: [
      {
        value: '',
        disabled: true,
      },
      {
        validators: [Validators.required],
      },
    ],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    //@ts-ignore
    this.profileService
      //@ts-ignore
      .patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
      .pipe(
        exhaustMap(() => this.profileService.getMe()),
        tap(() => this.router.navigate(['/profile/me'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined): string {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
