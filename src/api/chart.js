import { get } from "./tools";
import Apis from "./apis";

export const getChart = (params) => {
  const { dataset } = params;
  switch (dataset) {
    case "Urban-Mobility dataset":
      return fetchTaxiData(params);
    case "The United States Cancer Statistics dataset":
      return fetchCancerData(params);
    case "The MovieLens dataset":
      return fetchMovieData(params);
      break;
  }
  // TODO: 这里看看怎么根据图表类型差异化请求
};

function fetchTaxiData(params) {
  const { visualFormDimension, startDate, endDate } = params;
  let urlPath = Apis.get_urban;

  return get({
    url: urlPath,
    config: {
      params: {
        // visualForm↓
        visual_form: visualFormDimension,
        // model config↓
        mode: params.dataMode,
        round: params.round,
        // filter↓
        lat_from: params.latFrom,
        lat_to: params.latTo,
        lng_from: params.lngFrom,
        lng_to: params.lngTo,
        type: params.dataType,
        start_time: startDate.replace(/-/g, "/").replace(" ", "Z"),
        end_time: endDate.replace(/-/g, "/").replace(" ", "Z"),
      },
    },
  }).then((resp) => resp.data);
}


function fetchCancerData(params) {
  const { visualFormDimension, visualForm } = params;
  let urlPath;
  let search = {
    mode: params.dataMode,
    sex: params.sex,
    race: params.race,
    round: params.round,
  };
  switch(visualForm) {
    case 'treemap': 
    urlPath = Apis.get_treemap;
    Object.assign(search, {
      region: params.region,
      state: params.state,
    });
    break;
    case 'groupedBar': 
    urlPath = Apis.get_barchart;
    Object.assign(search, {
      category: params.cancerSite,
    });
    break;
  }

  return get({
    url: urlPath,
    config: {
      params: search,
    },
  }).then(({data}) => {
    // const {server, clients, ...others} = data.data;
    // // TODO: 这里只有一条数据，兼容前面的模式，转换成数组的形式
    // return {data: [{
    //   round: 0,
    //   server: {
    //     ...server,
    //     diagram_data: [[],[]]
    //   },
    //   clients,
    // }]};
    return {
      data: [{
        ...data.data,
        round: 0
      }]
    };
  });
}

function fetchMovieData(params) {
  let urlPath = Apis.get_movie;
  let titleParam = ["American Beauty (1999)",
  "Star Wars: Episode IV - A New Hope (1977)",
  "Star Wars: Episode V - The Empire Strikes Back (1980)",
  "Star Wars: Episode VI - Return of the Jedi (1983)",
  "Jurassic Park (1993)",
  "Saving Private Ryan (1998)",
  "Terminator 2: Judgment Day (1991)",
  "Matrix, The (1999)",
  "Back to the Future (1985)",
  "Silence of the Lambs, The (1991)",
  "Men in Black (1997)",
  "Raiders of the Lost Ark (1981)",
  "Fargo (1996)",
  "Sixth Sense, The (1999)",
  "Braveheart (1995)",
  "Shakespeare in Love (1998)",
  "Princess Bride, The (1987)",
  "Schindler's List (1993)",
  "L.A. Confidential (1997)",
  "Groundhog Day (1993)",
  "E.T. the Extra-Terrestrial (1982)",
  "Star Wars: Episode I - The Phantom Menace (1999)",
  "Being John Malkovich (1999)",
  "Shawshank Redemption, The (1994)",
  "Godfather, The (1972)"];
  let search = {
    mode: params.dataMode,
    // title: params.title,
    name: titleParam
  };

  return get({
    url: urlPath,
    config: {
      params: search,
    },
  }).then(({data: {data: roundList}}) => {
    const resultData = roundList.map(({server, clients, ...others})=>{
      const {values: _values, error: _error, ...otherServerProp} = server;
      return {
        ...others,
        server: {
          ...otherServerProp,
          diagram_data: [_values, _error]
        },
        clients: clients.map(({values, error, ...otherClientProp}) => {
          return {
            ...otherClientProp,
            diagram_data: [values, error]
          }
        })
      };
    }
  );
  return {data: resultData}
  });
}