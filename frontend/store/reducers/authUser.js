import { SIGNIN, RETRIEVE_DATA, LOGOUT } from '../actions/authUser';

const initialState = {
    /* token: null,
    userId: null,
    password: null,
    user:null */
    data: null,
}

const authUser = (state = initialState, action) => {
    switch (action.type) {
        case SIGNIN:
            return {
                /* token: action.token,
                userId: action.userId,
                password: action.password,
                user:action.user */
                data: action.data
            }
        case RETRIEVE_DATA:
            return {
                /* token: action.token,
                userId: action.userId,
                password: action.password,
                user:action.user */
                data: action.data
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
export default authUser;