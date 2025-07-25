import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { SvgIconComponent, TtInputComponent } from '@tt/common-ui';
import { AuthService, isLoginFormValue, LoginForm } from '@tt/data-access';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TtInputComponent, SvgIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  public form = new FormGroup<LoginForm>({
    username: new FormControl<string | null>(null, {
      validators: Validators.required
    }),
    password: new FormControl<string | null>(null, {
      validators: Validators.required
    })
  });

  public onSubmit(): void {
    if (this.form.valid) {
      if (isLoginFormValue(this.form.value)) {
        this.authService.login(this.form.value).subscribe(() => {
          this.router.navigate(['']);
        });
      }
    }
  }
}
