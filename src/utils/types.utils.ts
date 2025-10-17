export type UserType = 'superadmin' | 'admin' | 'vendor' | 'customer' | 'user';
export type LoginMethod = 'email' | 'biometric' | 'sso' | 'platform';
export type EmailDriver = 'sendgrid' | 'aws' | 'sendchamp' | 'mailtrap' | 'zepto';
export type ErrorsType = Array<string> | Array<number> | Array<{ message: string, field: string }>;
export type HTTPMethodType = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'HEAD';