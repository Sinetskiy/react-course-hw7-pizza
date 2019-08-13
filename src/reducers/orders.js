import {CREATE_NEW_ORDER} from '../modules/clients';
import {MOVE_ORDER_NEXT, MOVE_ORDER_BACK} from '../actions/moveOrder';
import {ADD_INGREDIENT} from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

const getConveyorState = (state, id, next) => {

    let order = state.find(v => v.id === id);
    switch (order.position) {
        case 'clients':
            order.position = 'conveyor_1';
            return [...state];
        case 'conveyor_1':
            order.position = next ? 'conveyor_2' : 'conveyor_1';
            return [...state];
        case 'conveyor_2':
            order.position = next ? 'conveyor_3' : 'conveyor_1';
            return [...state];
        case 'conveyor_3':
            order.position = next ? 'conveyor_4' : 'conveyor_2';
            return [...state];
        case 'conveyor_4':
            if (next)
                order.position = order.ingredients.length === order.recipe.length ? 'finish' : 'conveyor_4';
            else
                order.position = 'conveyor_3';
            return [...state];
        default:
            return [...state];
    }
};

const addIngredientToState = (state, payload) => {

    let order = state.find(v => v.position === payload.from);
    if (order.recipe.indexOf(payload.ingredient) > -1) {

        if (order.ingredients.indexOf(payload.ingredient) === -1)
            order.ingredients = [...order.ingredients, payload.ingredient];
    }
    return [...state];
};

export default (state = [], action) => {
    switch (action.type) {
        case CREATE_NEW_ORDER:
            return [...state, {...action.payload, ingredients: [], position: 'clients'}];
        case MOVE_ORDER_NEXT:
            return getConveyorState(state, action.payload, true);
        case MOVE_ORDER_BACK:
            return getConveyorState(state, action.payload, false);
        case ADD_INGREDIENT:
            return addIngredientToState(state, action.payload);
        default:
            return state;
    }
};

export const getOrdersFor = (state, position) =>
    state.orders.filter(order => order.position === position);
