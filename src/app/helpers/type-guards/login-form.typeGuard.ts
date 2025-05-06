import { LoginFormValue } from '../../pages/interfaces/login-form.interface';

export function isLoginFormValue(
  value: Partial<{
    username: string | null;
    password: string | null;
  }>
): value is LoginFormValue {
  return (
    typeof value.username === 'string' && typeof value.password === 'string'
  );
}
