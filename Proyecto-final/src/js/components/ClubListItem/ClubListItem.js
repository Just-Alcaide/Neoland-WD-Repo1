import { getLoggedUserData } from "../../main.js";
import { generateClubActionButtons } from "../../lib/generateClubActionButtons.js";
import { addClubButtonsListeners } from "../../lib/clubActions.js";

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
        this.shadowRoot.getElementById('clubMembers').textContent = `Miembros: ${clubData.members.length || 0}`;

        let clubTypeText = "";
        switch (clubData.type) {
            case "book":
                clubTypeText = "Club de Lectura";
                break;
            case "movie":
                clubTypeText = "Club de Cine";
                break;
            case "mixed":
                clubTypeText = "Club Mixto (Lectura y Cine)";
                break;
            default:
                break;
        }
        this.shadowRoot.getElementById('clubType').textContent = clubTypeText;

        const visitClubButton = this.shadowRoot.querySelector('.visitClubButton');
        visitClubButton.setAttribute('data-id', clubData._id);
        visitClubButton.addEventListener('click', () => this._visitClub());

        const actionsContainer = this.shadowRoot.getElementById('clubActions');
        actionsContainer.innerHTML = generateClubActionButtons(clubData, loggedUser);
        this._addClubButtonsListeners();
    }

    _visitClub() {
        const clubId = JSON.parse(this.club)._id;
        this.dispatchEvent(new CustomEvent("visit-club", { bubbles: true, composed: true, detail: { clubId}}))
    }

    _addClubButtonsListeners() {
        addClubButtonsListeners(this.shadowRoot);
    }
}

customElements.define('club-list-item', ClubListItem)