"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const redux_1 = require("redux");
const redux_logger_1 = __importDefault(require("redux-logger"));
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const immer_1 = require("immer");
//actions types
const INCREMENT = "account/increment";
const DECREMENT = "account/decrement";
const INCREMENT_BY_AMOUNT = "account/incrementByAmount";
const INIT = "account/init";
const INCREMENT_BONUS = "bonus/increment";
const GET_USER_ACCOUNT_PENDING = "account/getUser/pending";
const GET_USER_ACCOUNT_FULFILLED = "account/getUser/fulfilled";
const GET_USER_ACCOUNT_REJECTED = "account/getUser/rejected";
//reducer
// function accountReducer(state = { amount: 1 }, action) {
//   switch (action.type) {
//     case GET_USER_ACCOUNT_FULFILLED:
//       return { amount: action.payload, pending: false };
//     case GET_USER_ACCOUNT_PENDING:
//       return { ...state, pending: true };
//     case GET_USER_ACCOUNT_REJECTED:
//       return { ...state, error: action.error, pending: false };
//     case INCREMENT:
//     //   return { ...state, amount: state.amount + 1 };
//     case DECREMENT:
//       return { amount: state.amount - 1 };
//     case INCREMENT_BY_AMOUNT:
//       return { amount: state.amount + action.payload };
//     default:
//       return state;
//   }
// }
//using immer
const accountReducer = (state = { amount: 1 }, action) => {
    return (0, immer_1.produce)(state, draft => {
        switch (action.type) {
            case GET_USER_ACCOUNT_FULFILLED:
                if (action === null || action === void 0 ? void 0 : action.payload)
                    draft.amount = action.payload;
                draft.pending = false;
                break;
            case GET_USER_ACCOUNT_PENDING:
                draft.pending = true;
                break;
            case GET_USER_ACCOUNT_REJECTED:
                draft.error = action.error;
                draft.pending = false;
                break;
            case INCREMENT:
                draft.amount += 1;
                break;
            case DECREMENT:
                draft.amount -= 1;
                break;
            case INCREMENT_BY_AMOUNT:
                if (action === null || action === void 0 ? void 0 : action.payload)
                    draft.amount += action.payload;
                break;
            default:
                break;
        }
    });
};
function bonusReducer(state = { points: 0 }, action) {
    switch (action.type) {
        case INCREMENT_BONUS:
            return { points: state.points + 1 };
        case INCREMENT_BY_AMOUNT:
            if ((action === null || action === void 0 ? void 0 : action.payload) && action.payload >= 100)
                return { points: state.points + 1 };
        default:
            return state;
    }
}
//store
const store = (0, redux_1.createStore)((0, redux_1.combineReducers)({
    account: accountReducer,
    bonus: bonusReducer,
}), (0, redux_1.applyMiddleware)(redux_logger_1.default, redux_thunk_1.default));
//global state
store.subscribe(() => {
    // console.log(store.getState())
});
//Action creators
function getUser(id) {
    return (dispatch) => __awaiter(this, void 0, void 0, function* () {
        try {
            dispatch(getAccountUserPending());
            const { data } = yield axios_1.default.get(`http://localhost:3000/accounts/${id}`);
            dispatch(getAccountUserFulfilled(data.amount));
        }
        catch (err) {
            dispatch(getAccountUserRejected(err === null || err === void 0 ? void 0 : err.message));
        }
    });
}
function getAccountUserFulfilled(value) {
    return { type: GET_USER_ACCOUNT_FULFILLED, payload: value };
}
function getAccountUserPending() {
    return { type: GET_USER_ACCOUNT_PENDING };
}
function getAccountUserRejected(value) {
    return { type: GET_USER_ACCOUNT_REJECTED, error: value };
}
function initUser(value) {
    return { type: INIT, payload: value };
}
function increment() {
    return { type: INCREMENT };
}
function decrement() {
    return { type: DECREMENT };
}
function incrementByAmount(value) {
    return { type: INCREMENT_BY_AMOUNT, payload: value };
}
function incrementBonus() {
    return { type: INCREMENT_BONUS };
}
// dispatching an action -> {type: 'increment'}
// store.dispatch(increment())
// store.dispatch(decrement())
store.dispatch(incrementByAmount(400));
// store.dispatch(getUser(2));
// store.dispatch(incrementBonus())
//3 principles
//global state, immutablility , reducers should be pure
