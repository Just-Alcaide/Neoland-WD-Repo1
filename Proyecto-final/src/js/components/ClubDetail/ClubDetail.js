import { getLoggedUserData, API_PORT, getAPIUserData } from "../../club-lectura-v1.js";
import { generateClubActionButtons } from "../../lib/generateClubActionButtons.js";
import { addClubButtonsListeners } from "../../lib/clubActions.js";

import { importTemplate } from "../../lib/importTemplate.js";

import AppCSS from "../../../css/app.css" with { type: "css" };
import ClubDetailCSS from "./ClubDetail.css" with { type: "css" };

const TEMPLATE = {
    id: 'clubDetailTemplate',
    url: './js/components/ClubDetail/ClubDetail.html'
}

await importTemplate(TEMPLATE.url);

export class ClubDetail extends HTMLElement {

    static observedAttributes = ['club'];

    get club() {
        return JSON.parse(this.getAttribute('club'));
    }

    set club(newValue) {
        this.setAttribute('club', JSON.stringify(newValue));
    }

    get template() {
        return document.getElementById(TEMPLATE.id);
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    //========Life Cycle Callbacks==========//

    connectedCallback() {
        console.log("Custom element added to page.");
        this.shadowRoot.adoptedStyleSheets.push(AppCSS, ClubDetailCSS);
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
    
    async _setUpContent() {

        if (!this.shadowRoot || !this.template || !this.club) {
            console.log ('no hay shadow root o template o club') 
            return;
        }

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));

        this._renderClubDetails();
        await this._renderClubMembers();
        this._renderClubActions();
    }

    _renderClubDetails() {

        const clubData = this.club;

        this.shadowRoot.getElementById('clubDetailName').textContent = clubData.name;
        this.shadowRoot.getElementById('clubDetailDescription').textContent = clubData.description
        this.shadowRoot.getElementById('clubDetailType').textContent = clubData.type === "book" ? "Club de Lectura" : "Club de Cine";
    }

    async _renderClubMembers() {
        const clubData = this.club;
        const membersList = this.shadowRoot.getElementById('clubMembersList');

        if (!membersList) {
            return;
        }
        try {
            const membersData = await getAPIUserData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ ids: clubData.members }));

            membersList.innerHTML = '';
            membersList.innerHTML = membersData.map(member => 
            `<li>${member.name} ${clubData.admins.includes(member._id) ? '(Administrador)' : '(Miembro)'}</li>`
            ).join('');

        } catch (error) {
            console.log('Error: ', error);
        }
    }

    _renderClubActions() {
        const clubData = this.club;
        const loggedUser = getLoggedUserData();

        const actionsContainer = this.shadowRoot.getElementById('clubActionButtonsContainer');

        if (!loggedUser || !actionsContainer) {
            return;
        }

        actionsContainer.innerHTML = generateClubActionButtons(clubData, loggedUser);
        this._addClubButtonsListeners();
    }

    _addClubButtonsListeners() {
        addClubButtonsListeners(this.shadowRoot);
    }
}

customElements.define('club-detail', ClubDetail)