import { monitorLogger } from "../config/winston.config";
import { LoggerDTO, LogDirectDTO } from "../dtos/system.dto";
import ENV from "./env.util";
import colors from 'colors'

class Logger {

    constructor() { }

    /**
     * @name log
     * @param message 
     * @param options 
     */
    public log(message: string, options?: LoggerDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (options && options.type) {

            const { type, payload, className } = options;

            if (type === 'info') {

                if (display) {

                    if (className) {
                        console.log(`${className} - ${date} :: ${colors.blue(message)}`)
                    } else {
                        console.log(colors.blue(message))
                    }

                    if (payload) {
                        console.log(JSON.stringify(payload, null, 2))
                    }

                }

                if (monitor) {
                    
                }

            }

            if (type === 'error') {

                if (display) {

                    if (className) {
                        console.log(`${className} - ${date} :: ${colors.red(message)}`)
                    } else {
                        console.log(colors.red(message))
                    }

                    if (payload) {
                        console.log(JSON.stringify(payload, null, 2))
                    }

                }

                if (monitor) {

                }

            }

            if (type === 'warning') {

                if (display) {

                    if (className) {
                        console.log(`${className} - ${date} :: ${colors.yellow(message)}`)
                    } else {
                        console.log(colors.yellow(message))
                    }

                    if (payload) {
                        console.log(JSON.stringify(payload, null, 2))
                    }

                }

                if (monitor) {

                }

            }

            if (type === 'success') {

                if (display) {

                    if (className) {
                        console.log(`${className} - ${date} :: ${colors.green(message)}`)
                    } else {
                        console.log(colors.green(message))
                    }

                    if (payload) {
                        console.log(JSON.stringify(payload, null, 2))
                    }

                }

                if (monitor) {

                }

            }

            if (type === 'any') {

                if (display) {

                    if (className) {
                        console.log(`${className} - ${date} :: ${colors.white(message)}`)
                    } else {
                        console.log(colors.white(message))
                    }

                    if (payload) {
                        console.log(JSON.stringify(payload, null, 2))
                    }

                }

                if (monitor) {

                }

            }

        } 
        
        else {

            if (display) {

                console.log(message);

                if (options && options.payload) {
                    console.log(JSON.stringify(options.payload, null, 2))
                }

            }

            if (monitor) {
                // TODO: stream to external tracing/telemetry log platform
            }

        }

    }

    /**
     * @name info
     * @param message 
     * @param options 
     */
    public info(message: string, options?: LogDirectDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (display) {

            if (options && options.className) {
                console.log(`${options.className} - ${date} :: ${colors.blue(message)}`)
            } else {
                console.log(colors.blue(message))
            }

            if (options && options.payload) {
                console.log(JSON.stringify(options.payload, null, 2))
            }

        }

        if (monitor) {

        }
    }

    /**
     * @name error
     * @param message 
     * @param options 
     */
    public error(message: string, options?: LogDirectDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (display) {

            if (options && options.className) {
                console.log(`${options.className} - ${date} :: ${colors.red(message)}`)
            } else {
                console.log(colors.red(message))
            }

            if (options && options.payload) {
                console.log(JSON.stringify(options.payload, null, 2))
            }

        }

        if (monitor) {

        }
    }

    /**
     * @name warning
     * @param message 
     * @param options 
     */
    public warning(message: string, options?: LogDirectDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (display) {

            if (options && options.className) {
                console.log(`${options.className} - ${date} :: ${colors.yellow(message)}`)
            } else {
                console.log(colors.yellow(message))
            }

            if (options && options.payload) {
                console.log(JSON.stringify(options.payload, null, 2))
            }

        }

        if (monitor) {

        }
    }

    /**
     * @name success
     * @param message 
     * @param options 
     */
    public success(message: string, options?: LogDirectDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (display) {

            if (options && options.className) {
                console.log(`${options.className} - ${date} :: ${colors.green(message)}`)
            } else {
                console.log(colors.green(message))
            }

            if (options && options.payload) {
                console.log(JSON.stringify(options.payload, null, 2))
            }

        }

        if (monitor) {

        }
    }

    /**
     * @name any
     * @param message 
     * @param options 
     */
    public any(message: string, options?: LogDirectDTO) {

        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const monitor = options && options.monitor ? true : false;
        const display = options && options.display !== undefined ? options.display : true;

        if (display) {

            if (options && options.className) {
                console.log(`${options.className} - ${date} :: ${colors.white(message)}`)
            } else {
                console.log(colors.white(message))
            }

            if (options && options.payload) {
                console.log(JSON.stringify(options.payload, null, 2))
            }

        }

        if (monitor) {

        }
    }

}

export default new Logger()