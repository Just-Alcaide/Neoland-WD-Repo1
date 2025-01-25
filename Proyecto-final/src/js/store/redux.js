// @ts-check

import { Product, ProductFactory, Book, Movie, PRODUCT_TYPE } from "../classes/Product.js";
import { User } from "../classes/User.js";
import { Club } from "../classes/Club.js";
import { Proposal } from "../classes/Proposal.js";

/**
 * @typedef {Object} actionTypeProduct
 * @property {string} type
 * @property {Book | Movie} [product]
 */
/**
 * @typedef {Object} actionTypeUser
 * @property {string} type
 * @property {User} [user]
 */
/**
 * @typedef {Object} actionTypeClub
 * @property {string} type
 * @property {Club} [club]
 */
/**
 * @typedef {Object} actionTypeProposal
 * @property {string} type
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
 * @typedef {Object.<(string), any>} State
 * @property {Array<Book | Movie>} products
 * @property {Array<User>} users
 * @property {Array<Club>} clubs
 * @property {Array<Proposal>} proposals
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
 * @param {actionTypeProduct | actionTypeUser | actionTypeClub | actionTypeProposal} action 
 * @returns {State}
 */
  const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case ACTION_TYPES.CREATE_PRODUCT:
        if ('product' in action) {
        return {
          ...state,
          products: [
            ...state.products,
            action.product
          ]
        };
      }

      case ACTION_TYPES.READ_PRODUCT:
        return state

      case ACTION_TYPES.UPDATE_PRODUCT:
        if ('product' in action)
        return {
          ...state,
          products: state.products.map((/** @type {Book | Movie} */ product) => {
            if (product.id === action.product?.id) {
              return action.product
            }
            return product
          })
        };

      case ACTION_TYPES.DELETE_PRODUCT:
        if ('product' in action)
        return {
          ...state,
          products: state.products.filter((/** @type {Book | Movie} */ product) => product.id !== action.product?.id)
        };

      case ACTION_TYPES.CREATE_USER:
        if ('user' in action)
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
        if ('user' in action)
        return {
          ...state,
          users: state.users.map((/** @type {User} */ user) => {
            if (user.id === action.user?.id) {
              return action.user
            }
            return user
          })
        };

      case ACTION_TYPES.DELETE_USER:
        if ('user' in action)
        return {
          ...state,
          users: state.users.filter((/** @type {User}*/ user) => user.id !== action.user?.id)
        };

      case ACTION_TYPES.CREATE_CLUB:
        if ('club' in action)
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
        if ('club' in action)
        return {
          ...state,
          clubs: state.clubs.map((/** @type {User}*/ club) => {
            if (club.id === action.club?.id) {
              return action.club
            }
            return club
          })
        };

      case ACTION_TYPES.DELETE_CLUB:
        if ('club' in action)
        return {
          ...state,
          clubs: state.clubs.filter((/** @type {User}*/ club) => club.id !== action.club?.id)
        };

      case ACTION_TYPES.CREATE_PROPOSAL:
        if ('proposal' in action)
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
        if ('proposal' in action)
        return {
          ...state,
          proposals: state.proposals.map((/** @type {Proposal} */ proposal) => {
            if (proposal.id === action.proposal?.id) {
              return action.proposal
            }
            return proposal
          })
        };

      case ACTION_TYPES.DELETE_PROPOSAL:
        if ('proposal' in action)
        return {
          ...state,
          proposals: state.proposals.filter((/** @type {Proposal} */ proposal) => proposal.id !== action.proposal?.id)
        };

      default:
        return state;
    }
  }
  
//----------------------------------------No entiendo nada de esto----------------------------------------//
/**
 * @typedef {Object} Store
 */

  /**
   * create store singleton
   * @param {appReducer} reducer
   * @returns {Store}
   */
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer
  
    // Actions

    /**
     * create new product
     * @param {Book | Movie} product 
     * @returns 
     */
    const createProduct = (/** @type {Book | Movie} */ product) => _dispatch({ type: ACTION_TYPES.CREATE_PRODUCT, product });
  
    /**
     * read products
     * @param {Book | Movie} product
     * @returns 
     */
    const readProduct = (/** @type {Book | Movie} */ product) => _dispatch({ type: ACTION_TYPES.READ_PRODUCT, product });

    /**
     * update product
     * @param {Book | Movie} product 
     * @returns 
     */
    const updateProduct = (/** @type {Book | Movie} */ product) => _dispatch({ type: ACTION_TYPES.UPDATE_PRODUCT, product})

    /**
     * delete product
     * @param {Book | Movie} product 
     * @returns 
     */
    const deleteProduct = (/** @type {Book | Movie} */ product) => _dispatch({ type: ACTION_TYPES.DELETE_PRODUCT, product})

    /**
     * create new user
     * @param {User} user 
     * @returns 
     */
    const createUser = (/** @type {User} */ user) => _dispatch({ type: ACTION_TYPES.CREATE_USER, user });

    /**
     * read user list
     * @param {User} user
     * @returns 
     */
    const readUser = (/** @type {User} */ user) => _dispatch({ type: ACTION_TYPES.READ_USER, user });

    /**
     * update user
     * @param {User} user
     * @returns
     */
    const updateUser = (/** @type {User} */ user) => _dispatch({ type: ACTION_TYPES.UPDATE_USER, user });

    /**
     * delete user
     * @param {User} user
     * @returns
     */
    const deleteUser = (/** @type {User} */ user) => _dispatch({ type: ACTION_TYPES.DELETE_USER, user });

    /**
     * create new club
     * @param {Club} club 
     * @returns 
     */
    const createClub = (/** @type {Club} */ club) => _dispatch({ type: ACTION_TYPES.CREATE_CLUB, club });

    /**
     * read club list
     * @param {Club} club
     * @returns 
     */
    const readClub = (/** @type {Club} */ club) => _dispatch({ type: ACTION_TYPES.READ_CLUB, club });

    /**
     * update club
     * @param {Club} club 
     * @returns 
     */
    const updateClub = (/** @type {Club} */ club) => _dispatch({ type: ACTION_TYPES.UPDATE_CLUB, club });

    /**
     * delete club
     * @param {Club} club 
     * @returns 
     */
    const deleteClub = (/** @type {Club} */ club) => _dispatch({ type: ACTION_TYPES.DELETE_CLUB, club });

    /**
     * create new proposal
     * @param {Proposal} proposal 
     * @returns 
     */
    const createProposal = (/** @type {Proposal} */ proposal) => _dispatch({ type: ACTION_TYPES.CREATE_PROPOSAL, proposal });

    /**
     * read proposal list
     * @param {Proposal} proposal 
     * @returns 
     */
    const readProposal = (/** @type {Proposal} */ proposal) => _dispatch({ type: ACTION_TYPES.READ_PROPOSAL, proposal });

    /**
     * update proposal
     * @param {Proposal} proposal 
     * @returns 
     */
    const updateProposal = (/** @type {Proposal} */ proposal) => _dispatch({ type: ACTION_TYPES.UPDATE_PROPOSAL, proposal });

    /**
     * delete proposal
     * @param {Proposal} proposal 
     * @returns 
     */
    const deleteProposal = (/** @type {Proposal} */ proposal) => _dispatch({ type: ACTION_TYPES.DELETE_PROPOSAL, proposal });


    // Public methods
    const getState = () => { return currentState };
    
    /**
     * get product by id
     * @param {string} id 
     * @returns {Book | Movie | undefined}
     */
    const getProductById = (id) => { return currentState.articles.find((/** @type {Book | Movie} */ article) => article.id === id) };
  
    /**
     * get user by id
     * @param {string} id 
     * @returns {User | undefined} 
     */
    const getUserById = (id) => { return currentState.users.find((/** @type {User} */ user) => user.id === id) };

    /**
     * get club by id
     * @param {string} id 
     * @returns {Club | undefined} 
     */
    const getClubById = (id) => { return currentState.clubs.find((/** @type {Club} */ club) => club.id === id) };

    /**
     * get proposal by id
     * @param {string} id 
     * @returns {Proposal | undefined} 
     */
    const getProposalById = (id) => { return currentState.proposals.find((/** @type {Proposal} */ proposal) => proposal.id === id) };

    // Private methods

    /**
     * 
     * @param {actionTypeProduct | actionTypeUser | actionTypeClub | actionTypeProposal} action 
     * @param {function | undefined} [onEventDispatched] 
     */
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

    /**
     * 
     * @param {State} previousValue 
     * @param {State} currentValue 
     * @returns {Object}
     */
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
      createProduct,
      readProduct,
      updateProduct,
      deleteProduct,
      createUser,
      readUser,
      updateUser,
      deleteUser,
      createClub,
      readClub,
      updateClub,
      deleteClub,
      createProposal,
      readProposal,
      updateProposal,
      deleteProposal,

      // Public methods
      getState,
      getProductById,
      getUserById,
      getClubById,
      getProposalById
    }
  }
  
  // Export store
  export const store = createStore(appReducer)