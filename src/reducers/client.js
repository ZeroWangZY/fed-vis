import { SAVE_CLIENT_INFO, RESET_CLIENT_INFO } from "../actions/client";

// export const dataType = (state = 'start', action) => {
//   switch(action.type) {
//     case SET_BASE_PARAM:
//       return action.dataType;
//     default:
//       return state;
//   }
// }

// export const startTime = (state = '2017/5/19Z10:00', action) => {
//   switch(action.type) {
//     case SET_BASE_PARAM:
//       return action.startTime;
//     default:
//       return state;
//   }
// }

// export const endTime = (state = '2017/7/19Z12:00', action) => {
//   switch(action.type) {
//     case SET_BASE_PARAM:
//       return action.endTime;
//     default:
//       return state;
//   }
// }

// export const dataMode = (state = 'normal', action) => {
//   switch(action.type) {
//     case SET_BASE_PARAM:
//       return action.dataMode;
//     default:
//       return state;
//   }
// }

export const clientInfo = (state = {clients: []}, action) => {
  switch (action.type) {
    case SAVE_CLIENT_INFO:
      return action.clientInfo;
    case RESET_CLIENT_INFO: 
      return {clients: []};
    default:
      return state;
  }
};
