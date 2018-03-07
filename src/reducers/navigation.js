const initialState = {};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NAVIGATE': {
      return {
        currentView: action.view,
      };
    }
    default: {
      return state;
    }
  }
};

export default navigationReducer;