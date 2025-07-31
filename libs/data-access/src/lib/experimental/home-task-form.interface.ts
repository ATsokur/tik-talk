import { FormControl } from '@angular/forms';

export interface Appeal {
  assistance: FormControl<string | null>;
  compound: FormControl<string | null>;
  requestDescription: FormControl<string | null>;
}

export interface Employee {
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
}

export interface Option {
  label: string;
  value: string | null;
}
export interface Assistance {
  type: Option;
  compounds: Option[];
}

export interface CurrentCompounds {
  [key: string]: Option[];
}
