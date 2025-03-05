import { getAPIData, API_PORT} from "../../utils/apiService.js";
import AppCSS from '../../../css/app.css' with {type: 'css'} ;
import RegisterFormCSS from './RegisterForm.css' with {type: 'css'} ;

export class RegisterForm extends HTMLElement {
    constructor () {
        super()
    }

    connectedCallback () {
        this.attachShadow({ mode: "open" });

        this.shadowRoot.adoptedStyleSheets.push(AppCSS, RegisterFormCSS);
        
        this._setUpContent();

        const form = this.shadowRoot.getElementById("register-form");
        form.addEventListener("submit", this._onFormSubmit.bind(this));
    }

    disconnectedCallback() {
      }
    
      adoptedCallback() {

      }
    
      attributeChangedCallback() {

      }

    //Private Methods

    _setUpContent() {
        this.shadowRoot.innerHTML = `
        <form id="register-form">
            <h4>Registrar Nuevo Usuario: </h4>
            <label for="registerName">Nombre: </label>
            <input type="text" id="registerName" name="registerName" required>
            <label for="registerEmail">Email: </label>
            <input type="email" id="registerEmail" name="registerEmail" required>
            <label for="registerPassword">Contraseña: </label>
            <input type="password" id="registerPassword" name="registerPassword" required>
            <button type="submit">Registrarse</button>
        </form>
        `
    }

    async _onFormSubmit(e) {
        e.preventDefault();
        const newUser = await this._createNewUser()
        if (!newUser) {
            this.cleanUpRegisterForm()
            return
        }
        await this._loginNewUser()
        const onFormSubmitEvent = await this._loginNewUser()
        this.dispatchEvent(onFormSubmitEvent);
    }

    async _createNewUser() {
        const registerName = this.shadowRoot.getElementById("registerName").value;
        const registerEmail = this.shadowRoot.getElementById("registerEmail").value;
        const registerPassword = this.shadowRoot.getElementById("registerPassword").value;

        const newUser = {
            name: registerName,
            email: registerEmail,
            password: registerPassword,
            token: '',
            clubs: [],
            products: [],
            proposals: [],
            votes: [],
        };

        const payload = JSON.stringify(newUser);
        const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/users`, 'POST',  payload);

        if (!response) {
            alert("Hubo un error al registrar el usuario.");
            return null;
        }

        return response;
    }

    async _loginNewUser() {
        const registerEmail = this.shadowRoot.getElementById("registerEmail").value;
        const registerPassword = this.shadowRoot.getElementById("registerPassword").value;

        const loginData = {
            email: registerEmail,
            password: registerPassword,
        };

        let onFormSubmitEvent

        if (loginData.email !== "" && loginData.password !== "") {
            const payload = JSON.stringify(loginData);
            const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login/users`, 'POST', payload);
            onFormSubmitEvent = new CustomEvent("register-form-submit", {bubbles: true, 
            detail: apiData
            });

        } else {
            onFormSubmitEvent = new CustomEvent("register-form-submit", {bubbles: true,
            detail: null
            });
        }

        return onFormSubmitEvent
    }

    //Public Mehod

    cleanUpRegisterForm() {
        const registerName = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('registerName'))
        const registerEmail = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('registerEmail'))
        const registerPassword = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('registerPassword'))
    
        registerName.value = ''
        registerEmail.value = ''
        registerPassword.value = ''
    } 
}

customElements.define('register-form', RegisterForm);