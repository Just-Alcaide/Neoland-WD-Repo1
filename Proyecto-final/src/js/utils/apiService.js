//@ts-check

import { simpleFetch } from "../lib/simpleFetch.js";
import { HttpError } from "../classes/HttpError.js";
import { getLoggedUserData } from "./authService.js";

export const API_PORT = location.port ? `:${location.port}` : '';


/**
 * Fetches data from an API endpoint with error handling and authentication.
 *
 * Automatically attaches necessary headers, including authentication if a user is logged in.
 * Handles request timeouts and common HTTP errors (404, 500) by logging messages.
 *
 * @param {string} apiURL - The URL of the API endpoint to fetch data from.
 * @param {"GET" | "POST" | "PUT" | "DELETE"} [method='GET'] - The HTTP method to use for the request.
 * @param {any} [data] - The optional data payload to include in the request body, must be serializable.
 * 
 * @returns {Promise<any | null>} Resolves to the API response data (parsed as JSON if applicable), or `null` in case of an error.
 */

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