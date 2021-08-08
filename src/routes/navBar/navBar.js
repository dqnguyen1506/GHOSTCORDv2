import React, {useContext, useState , Component} from "react";
import firebase from "firebase/app";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import clsx from "clsx";
import {
    Drawer,
    AppBar,
    Toolbar,
    CssBaseline,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    Badge,
    ListItemText,
    Grid
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import GestureIcon from "@material-ui/icons/Gesture";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InfoIcon from "@material-ui/icons/Info";
import { Link, withRouter } from "react-router-dom";
import fire , {firestore} from "../../api-config/fire";
import { GlobalContext } from "../../global-context/State";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        width: '100vw',
        height: '7vh'
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#184a46",
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 1,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-start",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    link: {
        textDecoration: "none",
        color: "black",
        "&:hover": {
            color: "#184a46",
        },
    },
    logo:{
        marginLeft: '1%'
    }
}));

export default function PersistentDrawerRight({ history}) {
    // class navBar extends Component {
    //     render(){
    const { state, dispatch } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#ffffff");
    /* update user status to offline when signed out */
    const updateStatus = async () => {
        var usersRef = await firestore.collection("users").doc(state.user.email)
        var batch = await firestore.batch();

        await batch.update(usersRef, {
            status: "online"
        });
        await batch.update(usersRef, {
            status: "offline"
        });
        await batch.commit()
            .then(() => console.log('Success!'))
            .catch(err => console.error('Failed!', err));
    };
    /* update chatIsSelected (to false) when signed out*/
    const updateChatIsSelected = async () => {
        if(state.home.selectedChat != null){
            var chatsRef = await firestore.collection("chats").doc(state.home.chats[state.home.selectedChat].id);
            var batch = await firestore.batch();
            await batch.update(chatsRef, {
                usersHasRead: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email, hasRead: true, chatIsSelected: true})
            });
            await batch.update(chatsRef, {
                usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                    email: state.user.email, hasRead: true, chatIsSelected: false})
            });
            await batch.commit()
                .then(() => console.log('Success!'))
                .catch(err => console.error('Failed!', err));
        };
    };
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
    `;
    const signOut = async e => {
        e.preventDefault();
        await dispatch({
            type: "SET_LOADING",
            payload: true,
        });
        await updateStatus();
        await updateChatIsSelected();
        await dispatch({ type: "SET_SELECTED_GROUPCHATS_INDEX", payload: null });
        await dispatch({ type: "SET_SELECTED_DIRECTCHATS_INDEX", payload: null });
        await dispatch({ type: "SET_SELECTED_CHAT", payload: null });
        await dispatch({
            type: "SET_CHAT_INVITE_COUNT",
            payload: 0,
        });
        await dispatch({
            type: "SET_CHATS",
            payload: [],
        });
        fire.auth().signOut();
        if(state.display.showAlert === true){
            await dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        };
        if(state.alert.type !== 'logged out'){
            await dispatch({
                type: "SET_ALERT_TYPE",
                payload: 'logged out',
            });
        };
        if(state.alert.message !== 'Log out success.'){
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'Log out success.',
            });
        };
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });
        await dispatch({
            type: "SET_LOADING",
            payload: false,
        });
        history.push("/login");
    };

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="static"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                style={{
                    height:'auto',
                    // minHeight:50,
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0
                }}
            >
                <Grid
                    container
                    direction='row'
                    // justify='space-between'
                    alignItems='center'
                    style={{margin:'auto'}}
                >
                    <Link
                            variant="h9"
                            className={classes.title}
                            to="/dashboard"
                    >
                            <img
                                height="50px"
                                width="50px"
                                src={require("../../assets/logo/logo.png")}
                                alt="Ghostcord"
                                className={classes.logo}
                            />
                    </Link>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        // edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <Badge badgeContent={state.home.friendRequestsCount} color="secondary">
                            <MenuIcon />
                        </Badge>
                        
                    </IconButton>
                </Grid>
                {/* <Toolbar>
                    <Typography variant="h6" noWrap className={classes.title}>
                        <Link
                            variant="h9"
                            className={classes.title}
                            to="/dashboard"
                        >
                            <img
                                height="50px"
                                width="50px"
                                src={require("../logo/logo.png")}
                                alt="Ghostcord"
                                className={classes.logo}
                            />
                        </Link>
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <Badge badgeContent={state.home.friendRequestsCount} color="secondary">
                            <MenuIcon />
                        </Badge>
                        
                    </IconButton>
                </Toolbar> */}
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component={ Link } to="/video" variant="contained" color="primary">
                        <ListItemIcon>
                            <VideoCallIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Video
                        </ListItemText>
                    </ListItem>
                    <ListItem button component={ Link } to="/whiteboard" variant="contained" color="primary">
                        <ListItemIcon>
                            <GestureIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Whiteboard
                        </ListItemText>
                    </ListItem>
                    <ListItem button component={ Link } to="/friends" variant="contained" color="primary">
                        <ListItemIcon>
                        <Badge badgeContent={state.home.friendRequestsCount} color="secondary">
                            <PeopleIcon />
                        </Badge>
                            
                        </ListItemIcon>
                        <ListItemText>   
                            Friends
                        </ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button component={ Link } to="/profile" variant="contained" color="primary">
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Profile
                        </ListItemText>
                    </ListItem>
                    <ListItem button component={ Link } to="/about" variant="contained" color="primary">
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText>
                            About
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={e => signOut(e)}>
                        <ListItemIcon>
                            <ExitToAppIcon style={{fill:"red"}} />
                        </ListItemIcon>
                        <ListItemText style={{color: "red"}}>Logout</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
// }
// export default navBar;
