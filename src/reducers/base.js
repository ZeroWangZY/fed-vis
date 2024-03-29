import {
  SAVE_VISUAL_FORM,
  SET_BBOX,
  SET_PRECISION_ROUND,
  UPDATE_DIMENSION_TAXI,
} from "../actions/base";

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

export const visualForm = (state = "heatmap", action) => {
  switch (action.type) {
    case SAVE_VISUAL_FORM:
      return action.visualForm;
    default:
      return state;
  }
};
export const bbox = (state = {}, action) => {
  switch (action.type) {
    case SET_BBOX:
      return action.bbox;
    default:
      return state;
  }
};

export const dimensionTaxi = (state = null, action) => {
  switch (action.type) {
    case UPDATE_DIMENSION_TAXI:
      return {};
  }
};

export const precisionRound = (state = 300, action) => {
  switch (action.type) {
    case SET_PRECISION_ROUND:
      return action.precisionRound;
    default:
      return state;
  }
};
