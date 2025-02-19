import { getAPIUserData, API_PORT} from "../../club-lectura-v1.js";
import AppCSS from '../../../css/app.css' with {type: 'css'} ;
import LoginFormCSS from './LoginForm.css' with {type: 'css'} ;

export class LoginForm extends HTMLElement {
    constructor () {
        super()
    }

    connectedCallback() {
        console.log("Custom element added to page.");
        this.attachShadow({ mode: "open" });

        this.shadowRoot.adoptedStyleSheets.push(AppCSS, LoginFormCSS);
        
        this._setUpContent();

        const form = this.shadowRoot.getElementById("loginForm");
        form.addEventListener("submit", this._onFormSubmit.bind(this));
      }
    
      disconnectedCallback() {
        console.log("Custom element removed from page.");
      }
    
      adoptedCallback() {
        console.log("Custom element moved to new page.");
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`, oldValue, newValue);
      }

      //Private Methods

      _setUpContent() {
        this.shadowRoot.innerHTML = `
            <form id="loginForm">
            <h4>Iniciar Sesión: </h4>
            <label for="loginEmail">Email: </label>
            <input type="email" id="loginEmail" name="loginEmail" required>
            <label for="loginPassword">Contraseña: </label>
            <input type="password" id="loginPassword" name="loginPassword" required>
            <button type="submit">Iniciar Sesión</button>
            </form>
        `
      }

      async _onFormSubmit(e) {
        e.preventDefault();
        const loginEmail = this.shadowRoot.getElementById("loginEmail").value;
        const loginPassword = this.shadowRoot.getElementById("loginPassword").value;
        const loginData = {
          email: loginEmail,
          password: loginPassword,
        };

        let onFormSubmitEvent
        console.log(`Desde dentro del componente Email: ${loginEmail}, Password: ${loginPassword}`);

        if (loginData.email !== "" && loginData.password !== "") {
            const payload = JSON.stringify(loginData);
            const apiData = await getAPIUserData(`${location.protocol}//${location.hostname}${API_PORT}/api/login/users`, 'POST', payload);
            onFormSubmitEvent = new CustomEvent("login-form-submit", {bubbles: true,
            detail: apiData
            }); 
            

        } else {
            onFormSubmitEvent = new CustomEvent("login-form-submit", {bubbles: true,
            detail: null
            });
        }
        
        this.dispatchEvent(onFormSubmitEvent);
        
      }


      //Public Methods
      
      cleanUpLoginForm() {
        const loginEmail = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('loginEmail'))
        const loginPassword = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('loginPassword'))
    
        loginEmail.value = ''
        loginPassword.value = ''
    }
}

customElements.define('login-form', LoginForm)

/*importar y exportar*/
