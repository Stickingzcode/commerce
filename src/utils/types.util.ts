export type ErrorsType = Array<string> | Array<number> | Array<{ mesage: string, field: string }>;
export type UserType = 'superadmin' | 'admin' | 'vendor' | 'customer' | 'user'
export type EmailDriver = 'sengrid' | 'aws' | 'sendchamp' | 'mailtrap' | 'zepto' | 'brevo';
export type HTTPMethodType = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'HEAD';
export type LoginMethod = 'email' | 'biometric' | 'sso' | 'platform';