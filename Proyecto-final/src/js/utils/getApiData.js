import { simpleFetch } from "../lib/simpleFetch.js";
import { HttpError } from "../classes/HttpError.js";
import { getLoggedUserData } from "./getLoggedUserData.js";

export const API_PORT = location.port ? `:${location.port}` : '';


export async function getAPIData (apiURL, method = 'GET', data) {
    
    let apiData
    
    try {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        
        const loggedUser = getLoggedUserData();
        if (loggedUser) {
            headers.append('Authorization', `Bearer ${loggedUser.token}`)
        }

        apiData = await simpleFetch(apiURL, {
            signal: AbortSignal.timeout(3000),
            method: method,
            body: data ?? undefined,
            headers: headers
        });

    } catch (/** @type {any | HttpError} */ err){
        if (err.name === 'AbortError') {
            console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
            if (err.response.status === 404) {
                console.error('Error 404: Not Found');
            }
            if (err.response.status === 500) {
                console.error('Error 500: Internal Server Error');
            }
        }
    }

    return apiData
}