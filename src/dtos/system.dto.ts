import { LogType } from "../utils/types.util";

export interface LoggerDTO{
    type?: LogType,
    className?: string,
    payload?: object,
    monitor?: boolean,
    display?: boolean
}

export interface LogDirectDTO{
    className?: string,
    payload?: object,
    monitor?: boolean,
    display?: boolean
}