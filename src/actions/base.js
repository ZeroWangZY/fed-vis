export const SET_BASE_PARAM = "SET_BASE_PARAM";
export const SET_BBOX = "SET_BBOX";
export const CHECK_PROGRESS = "CHECK_PROGRESS";
export const SET_PRECISION_ROUND = "SET_PRECISION_ROUND";
export const SAVE_VISUAL_FORM = "SAVE_VISUAL_FORM";
export const UPDATE_DIMENSION_TAXI = "UPDATE_DIMENSION-TAXI";

export function checkProgress(id, chartType) {
  return {
    type: CHECK_PROGRESS,
    chartType,
    id,
  };
}

export function updateDimensionTaxi(datasetType) {
  return {
    type: UPDATE_DIMENSION_TAXI,
    datasetType,
  };
}

export function setBBox(bounds) {
  return {
    type: SET_BBOX,
    bbox: {
      latFrom: bounds._southWest.lat,
      latTo: bounds._northEast.lat,
      lngFrom: bounds._southWest.lng,
      lngTo: bounds._northEast.lng,
    },
  };
}

export function setPrecisionRound(precisionRound) {
  return {
    type: SET_PRECISION_ROUND,
    precisionRound,
  };
}
