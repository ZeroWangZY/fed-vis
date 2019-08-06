import L from 'leaflet';

const rankIcon = index => {
    return new L.Icon({
        iconUrl: require(`../../assets/img/number${index+1}.svg`),
        iconRetinaUrl: require(`../../assets/img/number${index+1}.svg`),
        iconAnchor: [15,30],
        popupAnchor: [0,-30],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: [30,30],
        className: 'leaflet-custome-icon'
    });
};

export { rankIcon };
