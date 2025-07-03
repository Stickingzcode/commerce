export type ErrorsType = Array<string> | Array<number> | Array<{ mesage: string, field: string }>;
export type UserType = 'superadmin' | 'admin' | 'vendor' | 'customer' | 'user'