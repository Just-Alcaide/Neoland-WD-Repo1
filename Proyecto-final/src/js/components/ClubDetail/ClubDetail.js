import { API_PORT, getAPIData } from "../../utils/apiService.js";
import { getLoggedUserData } from "../../utils/authService.js";
import { generateClubActionButtons, addClubButtonsListeners } from "../../utils/clubActions.js";

import AppCSS from "../../../css/app.css" with { type: "css" };
import ClubDetailCSS from "./ClubDetail.css" with { type: "css" };


export class ClubDetail extends HTMLElement {

    static observedAttributes = ['club'];

    get club() {
        return JSON.parse(this.getAttribute('club'));
    }

    set club(newValue) {
        this.setAttribute('club', JSON.stringify(newValue));
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    //========Life Cycle Callbacks==========//

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets.push(AppCSS, ClubDetailCSS);
    }

    adoptedCallback() {
    }

    attributeChangedCallback(name) {
        if (name === 'club') {
            this._setUpContent();
        }
    }
    
    disconnectedCallback() {
    }

    //========Private Methods==========//
    
    async _setUpContent() {

        this.shadowRoot.innerHTML = `    
        <h3 id=club-detail-name></h3>
        <p id="club-detail-description"></p>

        <h4>Tipo de Club:</h4>
        <p id="clubDetailType"></p>

        <h4>Miembros del Club:</h4>
        <ul id="club-members-list"></ul>

        <div id="club-action-buttons"></div>`;
 

        this._renderClubDetails();
        await this._renderClubMembers();
        this._renderClubActions();
    }

    _renderClubDetails() {

        const clubData = this.club;

        this.shadowRoot.getElementById('club-detail-name').textContent = clubData.name;
        this.shadowRoot.getElementById('club-detail-description').textContent = clubData.description

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

        this.shadowRoot.getElementById('clubDetailType').textContent = clubTypeText;
    }

    async _renderClubMembers() {
        const clubData = this.club;
        const membersList = this.shadowRoot.getElementById('club-members-list');

        if (!membersList) {
            return;
        }
        try {
            const membersData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`, 'POST', JSON.stringify({ ids: clubData.members }));

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

        const actionsContainer = this.shadowRoot.getElementById('club-action-buttons');

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