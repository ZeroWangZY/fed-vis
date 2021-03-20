const access_token =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

export const basicConfig = {
  // center:[39.8097343,-98.5556199],
  center: [20, 110.32],
  zoom: 13,
  // style - mapbox
  url:
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
    access_token,
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: "mapbox/light-v10",
};

export const heatMapConfig = {
  gradient: {
    // 0.1: '#89BDE0',
    // 0.2: '#96E3E6',
    // 0.4: '#82CEB6',
    // 0.6: '#FAF3A5',
    // 0.8: '#F5D98B',
    // 1.0: '#f17871'
    // '0': 'BLUE',
    // '0.66': 'YELLOW',
    // '1': 'RED'

    0.0: "#3a4085",
    0.2: "#5e8fc2",
    0.4: "#d1eae8",
    0.6: "#fed78b",
    0.8: "#e55335",
    1.0: "#a90626",
  },
  radius: 20,
  blur: 10,
};
