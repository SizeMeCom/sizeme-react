import { LOGIN } from "../actions/index";

const loggedIn = (state = false, action) => {
    switch (action.type) {
        case LOGIN:
            return true;

        default:
            return state;
    }
};

export default loggedIn;
