import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

const AMAPKEY = '09f13ffb9b4e34a8c411d3644baaa5c9';
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 200,
        zIndex: 999,
        backgroundColor: theme.palette.background.paper,
        opacity: 0.9,
        marginTop: '10px',
        height: '238px',
        borderRadius: '5px',
        position: 'absolute',
        left: '55px'
        // transform: `translate(420px,0)`
    },
    title: {
        lineHeight: '15px',
        margin: '10px 15px'
    },
    item: {
        height: '20px'
    },
    itemText: {
        lineHeight: '15px',
        fontSize: '14px',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center'
    },
    items: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '0'
    },
    selected: {
        backgroundColor: '#fff6da!important'
    },
    avatar: {
        margin: 2,
        color: '#fff',
        width: '15px',
        height: '15px',
        fontSize: '14px',
        backgroundColor: '#ffcc66'
    }
}));

export default function SelectedListItem(props) {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(
        [].fill(false, 0, 10)
    );
    const [poi, setPOI] = React.useState();

    useEffect(() => {
        fetchPOI();
    }, [props.data]);

    async function fetchPOI() {
        let urls = props.data.map(
            e =>
                `https://restapi.amap.com/v3/place/around?key=${AMAPKEY}&location=${e.lng},${e.lat}`
        );

        // 190000： 地名地址信息
        try {
            let data = await Promise.all(
                urls.map(url =>
                    fetch(url).then(res => {
                        if (res.ok) {
                            res.json().then(data => {
                                /**
                                 * count: "0"
                                 * info: "OK"
                                 * infocode: "10000"
                                 * pois: []
                                 * status: "1"
                                 * suggestion:
                                 */
                                if (data.status == 1) {
                                    // if(data.count!=0){
                                    //     return data.pois[0]
                                    // }
                                } else {
                                    console.error('Fetch POI ERROR',data);
                                    return [];
                                }
                            });
                        }
                    })
                )
            );
            setPOI(data);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    function handleListItemClick(event, index) {
        let t = selectedIndex.slice(0);
        t[index] = !selectedIndex[index];
        setSelectedIndex(t);
        props.createAMarker(index);
    }

    return (
        <div className={classes.root}>
            <p className={classes.title}>Top Ten</p>
            <Divider />
            <List
                component="nav"
                aria-label="secondary mailbox folder"
                className={classes.items}
            >
                {props.data.map((e, i) => (
                    <ListItem
                        className={classes.item}
                        classes={{ selected: classes.selected }}
                        key={e.count}
                        button
                        selected={selectedIndex[i]}
                        // onClick={event => handleListItemClick(event, i)}
                    >
                        <ListItemText
                            classes={{ primary: classes.itemText }}
                            primary={
                                <>
                                    <Avatar className={classes.avatar}>
                                        {i + 1}
                                    </Avatar>
                                    {e.count + ':' + e.lat + ',' + e.lng}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}