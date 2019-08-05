import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 200,
        zIndex: 1010,
        backgroundColor: theme.palette.background.paper,
        opacity: 0.9,
        marginTop: '10px',
        height: '238px',
        borderRadius: '5px',
        transform: `translate(420px,0)`

        // position: 'absolute',
        // bottom: '10px',
        // left: '10px'
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
        backgroundColor: '#DE9A96!important'
    },
    avatar: {
        margin: 2,
        color: '#fff',
        width: '15px',
        height: '15px',
        fontSize: '14px',
        backgroundColor: '#ffcc66',
    }
}));

const testData = [
    {
        rank: 1,
        name: 'test1'
    },
    {
        rank: 1,
        name: 'test2'
    },
    {
        rank: 1,
        name: 'test3'
    },
    {
        rank: 1,
        name: ' test4'
    },
    {
        rank: 1,
        name: ' test5'
    },
    {
        rank: 1,
        name: 'test6'
    },
    {
        rank: 1,
        name: 'test7'
    },
    {
        rank: 1,
        name: 'test8'
    },
    {
        rank: 1,
        name: 'test9'
    },
    {
        rank: 1,
        name: 'test10'
    }
];
export default function SelectedListItem(props) {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(
        [].fill(false, 0, 10)
    );

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
                        onClick={event => handleListItemClick(event, i)}
                    >
                        <ListItemText
                            classes={{ primary: classes.itemText }}
                            primary={
                                <>
                                    <Avatar className={classes.avatar}>
                                        {i}
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
