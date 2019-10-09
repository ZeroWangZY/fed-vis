export const ADD_BARCHART = 'ADD_BARCHART';
export const DELETE_BARCHART = 'DELETE_BARCHART';

export function addBarchart (start_time,
  type, //上车 or 下车数据
  end_time,
  lng_from,
  lng_to,
  lat_from,
  lat_to) {
  return { type: ADD_BARCHART,
    start_time,
    end_time,
    lng_from,
    lng_to,
    lat_from,
    lat_to};
}

export function deleteBarchart () {
  return { type: DELETE_BARCHART };
}
