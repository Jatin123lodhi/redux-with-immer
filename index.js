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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var redux_1 = require("redux");
var redux_logger_1 = require("redux-logger");
var redux_thunk_1 = require("redux-thunk");
var immer_1 = require("immer");
//actions types
var INCREMENT = "account/increment";
var DECREMENT = "account/decrement";
var INCREMENT_BY_AMOUNT = "account/incrementByAmount";
var INIT = "account/init";
var INCREMENT_BONUS = "bonus/increment";
var GET_USER_ACCOUNT_PENDING = "account/getUser/pending";
var GET_USER_ACCOUNT_FULFILLED = "account/getUser/fulfilled";
var GET_USER_ACCOUNT_REJECTED = "account/getUser/rejected";
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
var accountReducer = function (state, action) {
    if (state === void 0) { state = { amount: 1 }; }
    return (0, immer_1.produce)(state, function (draft) {
        switch (action.type) {
            case GET_USER_ACCOUNT_FULFILLED:
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
                draft.amount += action.payload;
                break;
            default:
                break;
        }
    });
};
function bonusReducer(state, action) {
    if (state === void 0) { state = { points: 0 }; }
    switch (action.type) {
        case INCREMENT_BONUS:
            return { points: state.points + 1 };
        case INCREMENT_BY_AMOUNT:
            if (action.payload >= 100)
                return { points: state.points + 1 };
        default:
            return state;
    }
}
//store
var store = (0, redux_1.createStore)((0, redux_1.combineReducers)({
    account: accountReducer,
    bonus: bonusReducer,
}), (0, redux_1.applyMiddleware)(redux_logger_1.default.default, redux_thunk_1.default.default));
//global state
store.subscribe(function () {
    // console.log(store.getState())
});
//Action creators
function getUser(id) {
    var _this = this;
    return function (dispatch, getState) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dispatch(getAccountUserPending());
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3000/accounts/".concat(id))];
                case 1:
                    data = (_a.sent()).data;
                    dispatch(getAccountUserFulfilled(data.amount));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    dispatch(getAccountUserRejected(err_1.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
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
