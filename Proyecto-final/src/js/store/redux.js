// @ts-check

import { Product, ProductFactory, Book, Movie, PRODUCT_TYPE } from "../classes/Product.js";
import { User } from "../classes/User.js";
import { Club } from "../classes/Club.js";
import { Proposal } from "../classes/Proposal.js";

/**
 * @typedef {Object} actionType
 * @property {string} type
 * @property {Product} [product]
 * @property {User} [user]
 * @property {Club} [club]
 * @property {Proposal} [proposal]
 */
const ACTION_TYPES = {
    CREATE_PRODUCT: 'CREATE_PRODUCT',
    READ_PRODUCT: 'READ_PRODUCT',
    UPDATE_PRODUCT: 'UPDATE_PRODUCT',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    CREATE_USER: 'CREATE_USER',
    READ_USER: 'READ_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    CREATE_CLUB: 'CREATE_CLUB',
    READ_CLUB: 'READ_CLUB',
    UPDATE_CLUB: 'UPDATE_CLUB',
    DELETE_CLUB: 'DELETE_CLUB',
    CREATE_PROPOSAL: 'CREATE_PROPOSAL',
    READ_PROPOSAL: 'READ_PROPOSAL',
    UPDATE_PROPOSAL: 'UPDATE_PROPOSAL',
    DELETE_PROPOSAL: 'DELETE_PROPOSAL'
}
/**
 * @typedef {Object} State
 * @property {Product[]} products
 * @property {User[]} users
 * @property {Club[]} clubs
 * @property {Proposal[]} proposals
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */
const INITIAL_STATE = {
    products: [],
    users: [],
    clubs: [],
    proposals: [],
    isLoading: false,
    error: false
}

/**
 * 
 * @param {State} state 
 * @param {actionType} action 
 * @returns 
 */
  const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case ACTION_TYPES.CREATE_PRODUCT:
        return {
          ...state,
          products: [
            ...state.products,
            action.product
          ]
        };
      case ACTION_TYPES.READ_PRODUCT:
        return state
      case ACTION_TYPES.UPDATE_PRODUCT:
        return {
          ...state,
          products: state.products.map((product) => {
            if (product.id === action.product.id) {
              return action.product
            }
            return product
          })
        };
      case ACTION_TYPES.DELETE_PRODUCT:
        return {
          ...state,
          products: state.products.filter((product) => product.id !== action.product.id)
        };
      case ACTION_TYPES.CREATE_USER:
        return {
          ...state,
          users: [
            ...state.users,
            action.user
          ]
        };
      case ACTION_TYPES.READ_USER:
        return state
      case ACTION_TYPES.UPDATE_USER:
        return {
          ...state,
          users: state.users.map((user) => {
            if (user.id === action.user.id) {
              return action.user
            }
            return user
          })
        };
      case ACTION_TYPES.DELETE_USER:
        return {
          ...state,
          users: state.users.filter((user) => user.id !== action.user.id)
        };
      case ACTION_TYPES.CREATE_CLUB:
        return {
          ...state,
          clubs: [
            ...state.clubs,
            action.club
          ]
        };
      case ACTION_TYPES.READ_CLUB:
        return state
      case ACTION_TYPES.UPDATE_CLUB:
        return {
          ...state,
          clubs: state.clubs.map((club) => {
            if (club.id === action.club.id) {
              return action.club
            }
            return club
          })
        };
      case ACTION_TYPES.DELETE_CLUB:
        return {
          ...state,
          clubs: state.clubs.filter((club) => club.id !== action.club.id)
        };
      case ACTION_TYPES.CREATE_PROPOSAL:
        return {
          ...state,
          proposals: [
            ...state.proposals,
            action.proposal
          ]
        };
      case ACTION_TYPES.READ_PROPOSAL:
        return state
      case ACTION_TYPES.UPDATE_PROPOSAL:
        return {
          ...state,
          proposals: state.proposals.map((proposal) => {
            if (proposal.id === action.proposal.id) {
              return action.proposal
            }
            return proposal
          })
        };
      case ACTION_TYPES.DELETE_PROPOSAL:
        return {
          ...state,
          proposals: state.proposals.filter((proposal) => proposal.id !== action.proposal.id)
        };
      default:
        return state;
    }
  }
  
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer
  
    // Actions
    // const createArticle = (article) => _dispatch({ type: ACTION_TYPES.CREATE_ARTICLE, article });
  
    // Public methods
    const getState = () => { return currentState };
    // const getArticleById = (id) => { return currentState.articles.find((article) => article.id === id) };
  
    // Private methods
    const _dispatch = (action, onEventDispatched) => {
      let previousValue = currentState;
      let currentValue = currentReducer(currentState, action);
      currentState = currentValue;
      // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
      window.dispatchEvent(new CustomEvent('stateChanged', {
          detail: {
              changes: _getDifferences(previousValue, currentValue)
          },
          cancelable: true,
          composed: true,
          bubbles: true
      }));
      if (onEventDispatched) {
          onEventDispatched();
      }
    }
    const _getDifferences = (previousValue, currentValue) => {
      return Object.keys(currentValue).reduce((diff, key) => {
          if (previousValue[key] === currentValue[key]) return diff
          return {
              ...diff,
              [key]: currentValue[key]
          };
      }, {});
    }
  
    return {
      // Actions
    //   createArticle,
      // Public methods
      getState,
    //   getArticleById
    }
  }
  
  // Export store
  export const store = createStore(appReducer)