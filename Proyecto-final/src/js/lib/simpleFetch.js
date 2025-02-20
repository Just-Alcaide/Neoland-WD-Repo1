import { HttpError } from '../classes/HttpError.js'

export async function simpleFetch (url, options) {
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpError(result);
  }
  let isJsonResponse = result.headers.get('Content-Type')?.includes('application/json');

  if (isJsonResponse) {
    return (await result.json());
  }
  return (await result.text());
}