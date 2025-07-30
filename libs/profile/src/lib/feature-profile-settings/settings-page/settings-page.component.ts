import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  ViewChild
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AddressInputComponent, TtStackInputComponent } from '@tt/common-ui';
import { profileActions, selectMe } from '@tt/data-access';

import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent,
    TtStackInputComponent,
    AddressInputComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    stack: [null],
    city: [null]
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profile()
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
          ...this.form.value
        }
      })
    );
    this.router.navigate(['/profile/me'], {
      queryParams: { param: 'save-settings' }
    });
  }
}
