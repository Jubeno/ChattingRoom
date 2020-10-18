export const authState = {
    isAuthenticated: false
}

const authReducer = (state, action) => {
    switch (action.type) {
      case 'changeTheme':
        return {
          ...state,
          theme: action.newTheme
        };
        
      default:
        return state;
    }
};

export default authReducer;