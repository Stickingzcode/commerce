import { HTTPMethodType } from "../utils/types.utils";

export interface CallAxiosDTO {
    method: HTTPMethodType,
    path: string,
    headers: object,
    body?: object
}