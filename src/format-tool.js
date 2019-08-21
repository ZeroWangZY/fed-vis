import coordtransform from 'coordtransform'

const MIN_LNG = 110.14
const MAX_LNG = 110.520
const MIN_LAT = 19.902
const MAX_LAT = 20.070

const LNG_SIZE = (MAX_LNG - MIN_LNG) * 1000 + 1
const LAT_SIZE = (MAX_LAT - MIN_LAT) * 1000 + 1

export const haikouProcessDataToPoints = (data) => {
    let points=[]
    data.forEach((item1,i) => {
      item1.forEach((item2, j) => {
        if(item2 !== 0){
            var gcj02tobd09=coordtransform.gcj02tobd09(i/1000. + MIN_LNG, j/1000. + MIN_LAT);
          points.push({
            lng: gcj02tobd09[0],
            lat: gcj02tobd09[1],
            count: item2
          })
        }
      })
    })
    return points
}

export const twoDimProcessDataToPoints = (data) => {

    let points=[]
    data.forEach((item1,i) => {
      item1.forEach((item2, j) => {
        if(item2 !== 0){
          points.push({
            lng: j - 180,
            lat: i - 90,
            count: item2
          })
        }
      })
    })
    return points
  }