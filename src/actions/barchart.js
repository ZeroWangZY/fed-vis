export const ADD_BARCHART = 'ADD_BARCHART';
export const DELETE_BARCHART = 'DELETE_BARCHART';
export const RENEW_BARCHART = 'RENEW_BARCHART';
export const CLEAR_BARCHART = 'CLEAR_BARCHART';
export const SELECT_BARCHART = 'SELECT_BARCHART';

// to modify
export function addBarchart(id, bounds) {
  return { 
    type: ADD_BARCHART,
    id,
    bounds,
  };
}

export function deleteBarchart(id) {
  return {
    type: DELETE_BARCHART,
    id,
  };
}

export function selectBarchart(id) {
  return {
    type: SELECT_BARCHART,
    id,
  };
}
