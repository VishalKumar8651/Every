// Redux Store Implementation

// Initial State
const initialState = {
    cart: {
        items: [],
        totalPrice: 0
    },
    user: null
};

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QTY = 'UPDATE_QTY';
const SET_CART = 'SET_CART';
const SET_USER = 'SET_USER';

// Action Creators
function addToCartAction(product, quantity = 1) {
    return {
        type: ADD_TO_CART,
        payload: { product, quantity }
    };
}

function removeFromCartAction(productId) {
    return {
        type: REMOVE_FROM_CART,
        payload: productId
    };
}

function updateQtyAction(productId, quantity) {
    return {
        type: UPDATE_QTY,
        payload: { productId, quantity }
    };
}

function setCartAction(cartData) {
    return {
        type: SET_CART,
        payload: cartData // Expecting { items: [], totalPrice: 0 }
    };
}

function setUserAction(user) {
    return {
        type: SET_USER,
        payload: user
    };
}

// Reducer
function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TO_CART:
            // Note: This is a simplified local update. 
            // Ideally, we should use the response from the server to ensure consistency,
            // especially for totalPrice which is calculated on the backend.
            // For now, we'll rely on SET_CART from server response mostly.
            const existingItemIndex = state.cart.items.findIndex(item => item.product._id === action.payload.product._id);
            let newItems;
            if (existingItemIndex >= 0) {
                newItems = [...state.cart.items];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + action.payload.quantity
                };
            } else {
                newItems = [...state.cart.items, { product: action.payload.product, quantity: action.payload.quantity }];
            }
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: newItems
                    // totalPrice needs to be recalculated or updated from server
                }
            };

        case REMOVE_FROM_CART:
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: state.cart.items.filter(item => item.product._id !== action.payload)
                }
            };

        case UPDATE_QTY:
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: state.cart.items.map(item =>
                        item.product._id === action.payload.productId
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                    )
                }
            };

        case SET_CART:
            return {
                ...state,
                cart: action.payload
            };

        case SET_USER:
            return {
                ...state,
                user: action.payload
            };

        default:
            return state;
    }
}

// Create Store
// We use window.Redux because we are loading it via CDN
const store = Redux.createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Subscribe to store updates for persistence (optional but good for debugging/logging)
store.subscribe(() => {
    console.log('State updated:', store.getState());
});
