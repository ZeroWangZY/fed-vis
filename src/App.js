import React from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Drawer, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import MapContainer from './component/map/MapContainer';

function processDataToPoints(data) {
    let points = [];
    data.forEach((item1, i) => {
        item1.forEach((item2, j) => {
            if (item2 !== 0) {
                points.push({
                    lng: j - 180,
                    lat: i - 90,
                    count: item2
                });
            }
        });
    });
    return points;
}

const drawerWidth = 350;

const styles = {
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
        background: '#d1d1d1',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        justifyContent: 'flex-start'
        // ...theme.mixins.toolbar,
    },
    content: {
        transition: 'margin cubic-bezier(0.4, 0, 0.6, 1) 225ms',
        // marginLeft: 0
    },
    contentShift: {
        // marginLeft: -drawerWidth,
        transition: 'margin cubic-bezier(0.4, 0, 0.6, 1) 225ms'
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataName: '',
            heatData: [],
            isDrawerOpen: true
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
    }

    handleClick() {
        fetch(this.state.dataName + '.json')
            .then(res => res.json())
            .then(data =>
                this.setState({
                    heatData: processDataToPoints(data),
                    dataName: ''
                })
            );
    }

    handleDrawerOpen() {
        this.setState({
            isDrawerOpen: true
        });
    }

    handleDrawerClose() {
        this.setState({
            isDrawerOpen: false
        });
    }
    render() {
        let { heatData, dataName } = this.state;
        let { isDrawerOpen } = this.state;
        const { classes } = this.props;

        const $input = (
            <>
                <InputBase
                    placeholder="input data name"
                    style={{ padding: '10px 20px' }}
                    inputProps={{ 'aria-label': 'input data name' }}
                    value={dataName}
                    onChange={e => this.setState({ dataName: e.target.value })}
                />
                <IconButton aria-label="Search" onClick={this.handleClick}>
                    <SearchIcon />
                </IconButton>
            </>
        );
        return (
            <div className="App">
                <div
                    className={clsx(classes.content, {
                        [classes.contentShift]: isDrawerOpen
                    })}
                >
                    <Paper
                        style={{
                            position: 'absolute',
                            marginLeft: '10px',
                            zIndex: 1000,
                            right: 0
                        }}
                    >
                        {$input}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={this.handleDrawerOpen}
                            className={clsx(isDrawerOpen && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Paper>
                    <MapContainer
                        heatData={heatData}
                        isDrawerOpen={isDrawerOpen}
                    />
                </div>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={isDrawerOpen}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.drawerHeader}>
                        {$input}
                        <IconButton
                            style={{ borderRight: '0.1em solid black' }}
                            onClick={this.handleDrawerClose}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                    <Divider />
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles)(App);
