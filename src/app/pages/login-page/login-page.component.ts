import {
  Component,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import {
  isLoginFormValue,
} from '../../helpers/type-guards/login-form.typeGuard';
import { LoginForm } from '../interfaces/login-form.interface';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public form = new FormGroup<LoginForm>({
    username: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
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
