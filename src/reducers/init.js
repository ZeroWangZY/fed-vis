import { INIT_FINISHED } from 'actions/init';

const init = (state = false, action) => {
  switch (action.type) {
    case INIT_FINISHED:
      return true;
    default:
      return state;
  }
};

export default init;
