import Axios, { AxiosError } from "axios";
import { CallAxiosDTO } from "../dtos/axios.dto";
import { IResult } from "../utils/interfaces.utils";

class AxiosService{

    constructor(){}

    /**
     * @name call
     * @param data 
     * @returns 
     */
    public async call(data: CallAxiosDTO): Promise<IResult>{

        let result: IResult = { error: false, message: '', code: 200, data: null }
        const { method, headers, path, body } = data;

        await Axios({
            method: method,
            headers: headers,
            url: path,
            data: body
        })
        .then((resp) => {
            const status = resp.status;
            result.data = { ...resp.data, status: status }
        })
        .catch((err: AxiosError) => {
            result.error = true;
            result.message = err.message ? err.message : 'An error occured';
            result.data = err.response && err.response.data ? err.response.data : null;
        })

        return result;

    }

}

export default new AxiosService();