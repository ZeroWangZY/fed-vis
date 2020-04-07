import { SET_BASE_PARAM, SET_BBOX, SET_PRECISION_ROUND } from '../actions/base';

export const dataType = (state = 'start', action) => {
  switch(action.type) {
    case SET_BASE_PARAM:
      return action.dataType;
    default:
      return state;
  }
}

export const startTime = (state = '2017/5/19Z10:00', action) => {
  switch(action.type) {
    case SET_BASE_PARAM:
      return action.startTime;
    default:
      return state;
  }
}

export const endTime = (state = '2017/7/19Z12:00', action) => {
  switch(action.type) {
    case SET_BASE_PARAM:
      return action.endTime;
    default:
      return state;
  }
}

export const dataMode = (state = 'normal', action) => {
  switch(action.type) {
    case SET_BASE_PARAM:
      return action.dataMode;
    default:
      return state;
  }
}

export const bbox = (state = {}, action) => {
  switch(action.type) {
    case SET_BBOX:
      return action.bbox;
    default:
      return state;
  }
}

export const precisionRound = (state = 300, action) => {
  switch(action.type) {
    case SET_PRECISION_ROUND:
      return action.precisionRound;
    default:
      return state;
  }
}