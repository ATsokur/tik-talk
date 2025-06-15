import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validatePhoneNumber(startWith: string): ValidatorFn {
  return (control: AbstractControl<number | null>): ValidationErrors | null => {
    if (control.value) {
      return control.value.toString().startsWith(startWith)
        ? null
        : {
            phoneNumber: {
              message: `Номер телефона должен начинаться с ${startWith}`,
            },
          };
    }
    return null;
  };
}
