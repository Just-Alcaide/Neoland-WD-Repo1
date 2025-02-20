import { getLoggedUserData } from "../../club-lectura-v1.js";
import { generateClubActionButtons } from "../../lib/generateClubActionButtons.js";

import { importTemplate } from "../../lib/importTemplate.js";

import AppCSS from "../../../css/app.css" with { type: "css" };
import ClubListItemCSS from "./ClubListItem.css" with { type: "css" };

const TEMPLATE = {
    id: 'clubListItemTemplate',
    url: './js/components/ClubListItem/ClubListItem.html'
}

await importTemplate(TEMPLATE.url);

export class ClubListItem extends HTMLElement {

    static observedAttributes = ['club'];
    
    get club() {
        return this.getAttribute('club');
      }

    set club(newValue) {
    this.setAttribute('club', newValue);
    }

    get template(){
        return document.getElementById(TEMPLATE.id);
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    //========Life Cycle Callbacks==========//

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets.push(AppCSS, ClubListItemCSS);
        }

    adoptedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'club') {
            console.log(`Attribute ${name} has changed.`, oldValue, newValue);

            this._setUpContent();
        }
    }

    disconnectedCallback() {
    }

    //========Private Methods==========//

    _setUpContent() {

        if (!this.shadowRoot || !this.template || !this.club) {
            console.log ('no hay shadow root o template o club') 
            return;
        }

        const clubData = JSON.parse(this.club);
        const loggedUser = getLoggedUserData();

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));

        this.shadowRoot.getElementById('clubName').textContent = `Nombre: ${clubData.name}`;
        this.shadowRoot.getElementById('clubDescription').textContent = `Descripción: ${clubData.description}`;
        this.shadowRoot.getElementById('clubType').textContent = clubData.type === "book" ? "Club de Lectura" : "Club de Cine";
        this.shadowRoot.getElementById('clubMembers').textContent = `Miembros: ${clubData.members.length || 0}`;

        const visitClubButton = this.shadowRoot.querySelector('.visitClubButton');
        visitClubButton.setAttribute('data-id', clubData._id);
        visitClubButton.addEventListener('click', () => this._visitClub());

        const actionsContainer = this.shadowRoot.getElementById('clubActions');
        actionsContainer.innerHTML = generateClubActionButtons(clubData, loggedUser);
        this._addButtonListeners();
    }

    _addButtonListeners() {
        this.shadowRoot.querySelector('.joinClubButton')?.addEventListener('click', (e) => this._joinClub(e));
        this.shadowRoot.querySelector('.leaveClubButton')?.addEventListener('click', (e) => this._leaveClub(e));
        this.shadowRoot.querySelector('.editClubButton')?.addEventListener('click', (e) => this._editClub(e));
        this.shadowRoot.querySelector('.deleteClubButton')?.addEventListener('click', (e) => this._deleteClub(e));
    }

    _visitClub() {
        const clubId = JSON.parse(this.club)._id;
        this.dispatchEvent(new CustomEvent("visit-club", { bubbles: true, composed: true, detail: { clubId}}))
    }

    async _joinClub(e) {
        e.preventDefault();
        const clubId = e.target.getAttribute('data-id');
        const isPrivate = e.target.getAttribute('data-private') === "true";
        let password = null;

        if (isPrivate) {
            password = prompt("Este club es privado. Ingresa la contraseña:");
            if (!password) return;
        }

        this.dispatchEvent(new CustomEvent("join-club", { bubbles: true, composed: true, detail: { clubId, password }}));
    }

    async _leaveClub(e) {
        e.preventDefault();
        const clubId = e.target.getAttribute('data-id');

        this.dispatchEvent(new CustomEvent("leave-club", { bubbles: true, composed: true, detail: { clubId }}));
    } 


    _editClub(e) {
        const clubId = e.target.getAttribute('data-id');

        this.dispatchEvent(new CustomEvent("edit-club", { bubbles: true, composed: true, detail: { clubId }}));
    }

    async _deleteClub(e) {
        const clubId = e.target.getAttribute('data-id');

        this.dispatchEvent(new CustomEvent("delete-club", { bubbles: true, composed: true, detail: { clubId }}));
    }
}

customElements.define('club-list-item', ClubListItem)