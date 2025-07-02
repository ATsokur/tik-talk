import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { profileActions, selectMe } from '@tt/data-access';

import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  #store = inject(Store);
  public profile = this.#store.selectSignal(selectMe);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  public form = this.fb.group({
    firstName: [
      '',
      {
        validators: [Validators.required]
      }
    ],
    lastName: [''],
    username: [
      {
        value: '',
        disabled: true
      },
      {
        validators: [Validators.required]
      }
    ],
    description: [''],
    stack: ['']
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profile(),
        //@ts-ignore
        stack: this.mergeStack(this.profile()?.stack)
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      this.#store.dispatch(
        profileActions.uploadAvatar({ file: this.avatarUploader.avatar })
      );
    }

    //@ts-ignore
    this.#store.dispatch(
      profileActions.patchProfile({
        //@ts-ignore
        profile: {
          ...this.form.value,
          stack: this.splitStack(this.form.value.stack)
        }
      })
    );
    this.router.navigate(['/profile/me'], {
      queryParams: { param: 'save-settings' }
    });
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
