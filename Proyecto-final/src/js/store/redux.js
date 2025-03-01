// @ts-check

// /** @typedef {import('../classes/Product.js')} Product */
// /** @typedef {import('../classes/User.js')} User */
// /** @typedef {import('../classes/Club.js')} Club */
// /** @typedef {import('../classes/Proposal.js')} Proposal */
// /** @typedef {import('../classes/Product.js').Book} Book */
// /** @typedef {import('../classes/Product.js').Movie} Movie */

/** @import {Product, Book, Movie} from "../classes/Product.js" */
/** @import {User} from  '../classes/User.js' */
/** @import { Club } from "../classes/Club.js"; */
/** @import { Proposal } from "../classes/Proposal.js"; */



// import { Product, ProductFactory, Book, Movie, PRODUCT_TYPE } from "../classes/Product.js";
// import { User } from "../classes/User.js";
// import { Club } from "../classes/Club.js";
// import { Proposal } from "../classes/Proposal.js";

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
    const actionWithProduct = /** @type {actionTypeProduct} */ (action);
    const actionWithUser = /** @type {actionTypeUser} */ (action);
    const actionWithClub = /** @type {actionTypeClub} */ (action);
    const actionWithProposal = /** @type {actionTypeProposal} */ (action);

    switch (action.type) {
      case ACTION_TYPES.CREATE_PRODUCT:
        return {
          ...state,
          products: [
            ...state.products,
            actionWithProduct.product
          ]
        };


      case ACTION_TYPES.READ_PRODUCT:
        return state

      case ACTION_TYPES.UPDATE_PRODUCT:
        return {
          ...state,
          products: state.products.map((/** @type {Book | Movie} */ product) => {
            if (product._id === actionWithProduct.product?._id) {
              return actionWithProduct.product
            }
            return product
          })
        };

      case ACTION_TYPES.DELETE_PRODUCT:
        return {
          ...state,
          products: state.products.filter((/** @type {Book | Movie} */ product) => product._id !== actionWithProduct.product?._id)
        };

      case ACTION_TYPES.CREATE_USER:
        return {
          ...state,
          users: [
            ...state.users,
            actionWithUser.user
          ]
        };

      case ACTION_TYPES.READ_USER:
        return state

      case ACTION_TYPES.UPDATE_USER:
        return {
          ...state,
          users: state.users.map((/** @type {User} */ user) => {
            if (user._id === actionWithUser.user?._id) {
              return actionWithUser.user
            }
            return user
          })
        };

      case ACTION_TYPES.DELETE_USER:
        return {
          ...state,
          users: state.users.filter((/** @type {User}*/ user) => user._id !== actionWithUser.user?._id)
        };

      case ACTION_TYPES.CREATE_CLUB:
        return {
          ...state,
          clubs: [
            ...state.clubs,
            actionWithClub.club
          ]
        };

      case ACTION_TYPES.READ_CLUB:
        return state

      case ACTION_TYPES.UPDATE_CLUB:
        return {
          ...state,
          clubs: state.clubs.map((/** @type {Club}*/ club) => {
            if (club._id === actionWithClub.club?._id) {
              return actionWithClub.club
            }
            return club
          })
        };

      case ACTION_TYPES.DELETE_CLUB:
        return {
          ...state,
          clubs: state.clubs.filter((/** @type {Club}*/ club) => club._id !== actionWithClub.club?._id)
        };

      case ACTION_TYPES.CREATE_PROPOSAL:
        return {
          ...state,
          proposals: [
            ...state.proposals,
            actionWithProposal.proposal
          ]
        };

      case ACTION_TYPES.READ_PROPOSAL:
        return state

      case ACTION_TYPES.UPDATE_PROPOSAL:
        return {
          ...state,
          proposals: state.proposals.map((/** @type {Proposal} */ proposal) => {
            if (proposal._id === actionWithProposal.proposal?._id) {
              return actionWithProposal.proposal
            }
            return proposal
          })
        };

      case ACTION_TYPES.DELETE_PROPOSAL:
        return {
          ...state,
          proposals: state.proposals.filter((/** @type {Proposal} */ proposal) => proposal._id !== actionWithProposal.proposal?._id)
        };

      default:
        return state;
    }
  }
  
//----------------------------------------No entiendo nada de esto (vale, ya voy entendiendo algo)----------------------------------------//
/**
 * @typedef {Object} PublicMethods
 * @property {function} create
 * @property {function} read
 * @property {function} update
 * @property {function} delete
 * @property {function} getById
 */



/**
 * @typedef {Object} Store
 * @property {function} getState
 * @property {function} saveState
 * @property {function} loadState 
 * @property {PublicMethods} product
 * @property {PublicMethods} user
 * @property {PublicMethods} club
 * @property {PublicMethods} proposal
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
    const getProductById = (id) => { return currentState.products.find((/** @type {Book | Movie} */ product) => product._id === id) };
  
    /**
     * get user by id
     * @param {string} id 
     * @returns {User | undefined} 
     */
    const getUserById = (id) => { return currentState.users.find((/** @type {User} */ user) => user._id === id) };

    /**
     * get club by id
     * @param {string} id 
     * @returns {Club | undefined} 
     */
    const getClubById = (id) => { return currentState.clubs.find((/** @type {Club} */ club) => club._id === id) };

    /**
     * get proposal by id
     * @param {string} id 
     * @returns {Proposal | undefined} 
     */
    const getProposalById = (id) => { return currentState.proposals.find((/** @type {Proposal} */ proposal) => proposal._id === id) };

    /**
     * load state from local Storage and save in Store
     */
    const loadState = () => {
      const state = localStorage.getItem('storedData');
      if (state) {
        currentState = JSON.parse(state);
      }
    }

    /**
     * save Store State to local Storage
     */
    const saveState = () => {
      localStorage.setItem('storedData', JSON.stringify(currentState));
    }

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
  
    // namespaces actions
    const product = {
      create: createProduct,
      read: readProduct,
      update: updateProduct,
      delete: deleteProduct,
      getById: getProductById
    }

    const user = {
      create: createUser,
      read: readUser,
      update: updateUser,
      delete: deleteUser,
      getById: getUserById
    }

    const club = {
      create: createClub,
      read: readClub,
      update: updateClub,
      delete: deleteClub,
      getById: getClubById
    }

    const proposal = {
      create: createProposal,
      read: readProposal,
      update: updateProposal,
      delete: deleteProposal,
      getById: getProposalById
    }

    return {
      // Actions
      product,
      user,
      club,
      proposal,

      // Public methods
      getState,
      saveState, 
      loadState
    }
  }
  
  // Export store
  export const store = createStore(appReducer)

  