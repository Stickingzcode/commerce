import { HTTPMethodType } from "../utils/types.util";

export interface CallAxiosDTO{
    method: HTTPMethodType,
    path: string,
    headers: object,
    body?: object
}