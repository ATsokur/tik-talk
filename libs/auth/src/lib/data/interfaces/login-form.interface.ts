import { FormControl } from '@angular/forms';

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface LoginFormValue {
  username: string;
  password: string;
}
