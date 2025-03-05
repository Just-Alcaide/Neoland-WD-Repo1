import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, API_PORT} from "../../utils/apiService.js";

import AppCSS from '../../../css/app.css' with { type: "css" };
import LoginFormLitCSS from './LoginFormLit.css' with { type: "css" };


export class LoginFormLit extends LitElement {
    static styles = [AppCSS, LoginFormLitCSS];

    static properties = {
        propiedad: {type: String}
    };

    get _loginEmail(){
        return this.renderRoot?.querySelector('#loginEmail');
    }

    get _loginPassword(){
        return this.renderRoot?.querySelector('#loginPassword');
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <form id="loginForm" @submit="${this._onFormSubmit}">
                <h4>Iniciar Sesión: ${this.propiedad}</h4>
                <label for="loginEmail">Email: </label>
                <input type="email" id="loginEmail" name="loginEmail" required>
                <label for="loginPassword">Contraseña: </label>
                <input type="password" id="loginPassword" name="loginPassword" required>
                <button id="login-button" type="submit">Iniciar Sesión</button>
            </form>
        `;
    }

    async _onFormSubmit(e) {
        e.preventDefault();
        const loginEmail = this._loginEmail;
        const loginPassword = this._loginPassword;
        const loginData = {
          email: loginEmail.value,
          password: loginPassword.value,
        };

        let onFormSubmitEvent

        if (loginData.email !== "" && loginData.password !== "") {
            const payload = JSON.stringify(loginData);
            const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login/users`, 'POST', payload);
            onFormSubmitEvent = new CustomEvent("login-form-submit", {bubbles: true,
            composed: true,
            detail: apiData
            }); 

        } else {
            onFormSubmitEvent = new CustomEvent("login-form-submit", {bubbles: true,
            detail: null
            });
        }
        
        this.dispatchEvent(onFormSubmitEvent);
        
      }

      cleanUpLoginForm() {
        const loginEmail = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('loginEmail'))
        const loginPassword = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('loginPassword'))
    
        loginEmail.value = ''
        loginPassword.value = ''
    }

}


customElements.define('login-form', LoginFormLit)