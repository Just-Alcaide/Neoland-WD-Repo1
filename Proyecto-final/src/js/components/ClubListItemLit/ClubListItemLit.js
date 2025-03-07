import { LitElement, html, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

import { generateClubActionButtons, addClubButtonsListeners } from "../../utils/clubActions.js";
import { getLoggedUserData } from '../../utils/authService.js';

import AppCSS from '../../../css/app.css' with { type: "css" };
import ClubListItemCSS from "./ClubListItemLit.css" with { type: "css" };

export class ClubListItemLit extends LitElement {
    static styles = [AppCSS, ClubListItemCSS]

    static properties = {
        club: { type: Object }
    }

    constructor() {
        super();
        this.club = {};
    }

    render() {
        const loggedUser = getLoggedUserData();
        const isMember = this.club.members.includes(loggedUser?._id);
        const isAdmin = this.club.admins.includes(loggedUser?._id);
        const canVisit = isMember || isAdmin;
    
        return html`
        <li>
            <h3 id="clubName">Nombre: ${this.club.name}</h3>
            <p id="clubDescription">Descripción: ${this.club.description}</p>
            <p id="clubType">${this._getClubTypeText(this.club.type)}</p>
            <p id="clubMembers">Miembros: ${this.club.members.length || 0}</p>
            ${canVisit ? html`<button class="visit-club-button" @click=${this._visitClub}>Visitar Club</button>` : html``}
            <div id="club-action-buttons">${this._renderClubActions()}</div>
        </li>
        `;
    }

    _getClubTypeText(type) {
        switch (type) {
            case 'book':
                return 'Club de Lectura';
            case 'movie':
                return 'Club de Cine';
            case 'mixed':
                return 'Club Mixto (Lectura y Cine)';
            default:
                return '';
        }
    }

    _renderClubActions() {
        const loggedUser = getLoggedUserData();
        if (!loggedUser || !this.club) return html``;
        const buttons = generateClubActionButtons(this.club, loggedUser);
        return html`${unsafeHTML(buttons)}`
    }

    _visitClub() {
        const clubId = this.club._id;
        this.dispatchEvent(new CustomEvent("visit-club", { bubbles: true, composed: true, detail: { clubId}}))
    }

    updated() {
        const clubActionsContainer = this.renderRoot?.getElementById('club-action-buttons');
        addClubButtonsListeners(clubActionsContainer);
    }
}

customElements.define('club-list-item', ClubListItemLit);