import { SHOW_ODMAP } from 'actions/odmap';

const odmapData = (state = [], action) => {
  switch (action.type) {
    case SHOW_ODMAP:
      let [min, max] = getMinMax(action.odmapData.data);
      return {data: action.odmapData.data, min: min, max: max};
    default:
      return state;
  }
};

export default odmapData;

function getMinMax (data) {
  let min = 999, max = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      for (let m = 0; m < data[i][j].length; m++) {
        for (let n = 0; n < data[i][j][m].length; n++) {
          if (data[i][j][m][n] < min) min = data[i][j][m][n];
          if (data[i][j][m][n] > max) max = data[i][j][m][n];
        }
      }
    }
  }
  return [min, max];
}
