import { simpleFetch } from "./simpleFetch.js";


export async function importTemplate (templateUrl) {
    const templateContent = await simpleFetch(templateUrl);

    document.body.insertAdjacentHTML('beforeend', templateContent);
}