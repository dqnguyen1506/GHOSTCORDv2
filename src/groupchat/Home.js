import React, {useState, useEffect, useContext } from "react";
import { 
    Button, 
    Badge, 
    Avatar, 
    Divider, 
    IconButton, 
    Grid, 
    Tab, 
    AppBar,
    Box,
    Typography,
    Tabs,
    useTheme,
    Slide
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SwipeableViews from 'react-swipeable-views';
import PersonAddSharpIcon from "@material-ui/icons/PersonAddSharp";
import fire, { auth, firestore } from "../config/fire";
import PeopleIcon from '@material-ui/icons/People';
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ChatIcon from '@material-ui/icons/Chat';
import { withStyles } from "@material-ui/core/styles";
import { CreateChat } from "./CreateChat";
import { ChatInvite } from "./ChatInvite";
import {ChatAcceptComponent}  from "./ChatAccept";
import ChatsListComponent from "./ChatsList";
import ChatViewComponent from "./ChatView";
import { GlobalContext } from "../state/State";
import NavBarComponent from "../navBar/navBar";
import Burger from "../burger/burger";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import FriendsListComponent from "../friends/FriendsList";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import AlertComponent from './Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
}));

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "$ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}))(Badge);

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const HomeComponent = ({ history }) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div>
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
                >
                    {value === index && (
                        <Box>
                            <Typography>{children}</Typography>
                        </Box>
                    )}
                </div>
            </div>
        );
    }
    const theme = useTheme();

    /* update user status to online when signed in*/
    const updateStatus = async () => {
        var usersRef = firestore.collection("users").doc(state.user.email)
        var batch = firestore.batch();
        
        await firestore
            .collection("users")
            .doc(state.user.email)
            .get()
            .then((res) => {
                if(res.data().friends === undefined){
                    // alert("it's null");
                    batch.update(usersRef, {
                        friends: [],
                        received: [],
                        sent: [],
                    });
                }else{
                    // alert("it's not null");
                }
            })

        batch.update(usersRef, {
            status: "offline"
        });
        batch.update(usersRef, {
            status: "online"
        });
        batch.commit()
            .then(() => console.log('Success!'))
            .catch(err => console.error('Failed!', err));
    };
    useEffect(() => {
        if (state.user.email === null) {
            dispatch({
                type: "SET_CHATS",
                payload: [],
            });
        } else {
            updateStatus();
            var unsubscribe1 = firestore
                .collection("chats")
                .where("users", "array-contains", state.user.email)
                .onSnapshot((result) => {
                    // anytime there is an update in database, call this to update chat list
                    dispatch({
                        type: "SET_CHATS",
                        payload: result.docs.map((doc) => doc.data()),
                    });
                });
            // firestore
            //     .collection("users")
            //     .get()
            //     .then((res) => {
            //         let temp = state.home.loadedAvatars;
            //         let temp2 = state.home.statuses;
            //         temp = res.docs.map((doc) => {
            //             if(temp[doc.data().email] != doc.data().avatar){
            //                 temp[doc.data().email] = doc.data().avatar;
            //             }
            //             temp2[doc.data().email] = doc.data().status;
            //         });                   
            //         dispatch({
            //             type: "SET_AVATARS",
            //             payload: temp,
            //         });
            //         dispatch({
            //             type: "SET_STATUSES",
            //             payload: temp2,
            //         });
            //     });

            /* set user avatars, user status, friend request count, 
                notfication alert, and user friends */
            var unsubscribe4 = firestore
                .collection("users")
                .onSnapshot((res) => {
                    // let users = res.docs.map((doc) => doc.data());
                    /* upon first loading and future changes to database, update data*/
                    res.docChanges().forEach((change) =>{
                        /* update avatar */
                        let temp = state.home.loadedAvatars;
                        if(temp[change.doc.data().email] = change.doc.data().avatar){
                            temp[change.doc.data().email] = change.doc.data().avatar;
                        }         
                        dispatch({
                            type: "SET_AVATARS",
                            payload: temp,
                        });
                        /* update status */
                        let temp2 = state.home.statuses;
                        if(temp2[change.doc.data().email] != change.doc.data().status){
                            temp2[change.doc.data().email] = change.doc.data().status;   
                        }           
                        dispatch({
                            type: "SET_STATUSES",
                            payload: temp2,
                        });
                        // if(change.doc.data().email === state.user.email && change.doc.data().received != null){
                        //     /* update friend request count */
                        //     if(state.home.friendRequestsCount != change.doc.data().received.length){
                        //         dispatch({
                        //             type: "SET_FRIEND_REQUEST_COUNT",
                        //             payload: change.doc.data().received.length,
                        //         });
                        //     }
                        //     /* update friend request alert */
                        //     if (change.doc.data().received.length > 0){
                        //         dispatch({
                        //             type: "SET_SHOW_REQUEST_NOTIFICATION",
                        //             payload: '',
                        //         });
                        //     }else{
                        //         dispatch({
                        //             type: "SET_SHOW_REQUEST_NOTIFICATION",
                        //             payload: 'none',
                        //         });
                        //     }
                        //     /* update user friends */
                        //     var friends = res.docs[0].data().friends;
                        // var loopData = ''
                        // for(var x in friends){
                        //     const email = friends[x].email;
                        //     loopData += `${email} `
                        // }
                        // dispatch({ 
                        //     type: "SET_FRIENDS", 
                        //     payload: loopData.split(" ")
                        // });
                        // }
                    });
                    
                });

            /* UNCOMMENT this if real time status update is needed */
            // var unsubscribe4 = firestore
            //     .collection("users")
            //     .onSnapshot((res) => {
            //         let temp = state.home.loadedAvatars;
            //         let temp2 = state.home.statuses;
            //         temp = res.docs.map((doc) => {
            //             temp2[doc.data().email] = doc.data().status;
            //         });                   
            //         dispatch({
            //             type: "SET_STATUSES",
            //             payload: temp2,
            //         });
            //     });

            /* whenever there is a new chat invite (database update detected)
                display a notification*/
            var unsubscribe2 = firestore
                .collection("chats")
                .where("invited", "array-contains", state.user.email)
                .onSnapshot((result) => {
                    // let chats = result.docs.map((doc) => doc.data());
                    let count = result.docs.length;
                    dispatch({
                        type: "SET_CHAT_INVITE_COUNT",
                        payload: count,
                    });
                });

            /*  update friend request counts and whether to display a request
                notification as well as username (whenever a database update is detected) */
            firestore
                .collection("users")
                .where("email", "==", state.user.email)
                .onSnapshot((res) => {
                    if(res.docs[0] != null){
                        // update username
                        if(res.docs[0].data().name !== state.user.username){
                            dispatch({
                                type: "SET_USERNAME",
                                payload: res.docs[0].data().name,
                            });
                        }
                        // // update email
                        // if(res.docs[0].data().email !== state.user.email){
                        //     dispatch({
                        //         type: "SET_EMAIL",
                        //         payload: res.docs[0].data().email,
                        //     });
                        // }
                        //setReceivedCount(res.docs[0].data().received.length);
                        if(res.docs[0].data().friends != null){
                            dispatch({
                                type: "SET_FRIEND_REQUEST_COUNT",
                                payload: res.docs[0].data().received.length,
                            });
                            if (res.docs[0].data().received.length > 0){
                                dispatch({
                                    type: "SET_SHOW_REQUEST_NOTIFICATION",
                                    payload: '',
                                });
                            }else{
                                dispatch({
                                    type: "SET_SHOW_REQUEST_NOTIFICATION",
                                    payload: 'none',
                                });
                            }
                            var friends = res.docs[0].data().friends;
                            var loopData = ''
                            for(var x in friends){
                                const email = friends[x].email;
                                loopData += `${email} `
                            }
                            dispatch({ 
                                type: "SET_FRIENDS", 
                                payload: loopData.split(" ")
                            });
                            if(state.user.username === null){
                                dispatch({ 
                                    type: "SET_USERNAME", 
                                    payload: res.docs[0].data().name
                                });
                            }
                        }else{
                            dispatch({ 
                                type: "SET_FRIENDS", 
                                payload: []
                            });
                        }
                        
                    }
                    
                    
                });
            return () => {
                unsubscribe1();
                unsubscribe2();
                // unsubscribe3();
                unsubscribe4();
            };
        }
        //re-render everytime dispatch or user email is changed (re-logged in)
    }, [ state.user.auth, state.user.email]); 
    
    
    const createChat = (name) => {
        if (name) {
            firestore
                .collection("chats")
                .add({
                    type: "groupchat",
                    messages: [],
                    invited: [],
                    users: [state.user.email],
                    name: name,
                    owner: state.user.email,
                    id: null,
                })
                .then((res) => {
                    firestore.collection("chats").doc(res.id).update({
                        id: res.id,
                        usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                            email: state.user.email, 
                            hasRead: false, 
                            chatIsSelected: false})
                    });
                })
                .catch((err) => {
                    console.log("Error creating room: %s", err.code);
                });
            dispatch({ 
                type: "SET_SHOW_CHAT_CREATE", 
                payload: false 
            });
            //this.setState({ showCreateChat: false });
        } else {
            console.log("room not created");
        }
    };

    const selectChat = (chatIndex) => {
        /* if user selects a different chat than the one currently selected */
        if(chatIndex != state.home.selectedChat){
            /* checking hasRead value to remove */
            var hasRead = false;
            var prevHasRead = false;
            var chatIsSelected = false;
            for(var x in state.home.chats[chatIndex].usersHasRead){
                if(state.home.chats[chatIndex].usersHasRead[x].email === state.user.email){
                    hasRead = state.home.chats[chatIndex].usersHasRead[x].hasRead;
                    // if(state.home.selectedChat != null){
                    //     prevHasRead = state.home.chats[state.home.selectedChat].usersHasRead[x].hasRead;
                    // }
                    chatIsSelected = state.home.chats[chatIndex].usersHasRead[x].chatIsSelected;
                }
            };
            /* CURRENT SELECTED CHAT HANDLER */
            /* user selects current chat ==> user hasRead the chat and current chat is selected */
            /* remove and update current user's hasRead as well as chatIsSelected value in usersHasRead arr */
            var chatsRef = firestore.collection("chats").doc(state.home.chats[chatIndex].id);
            var batch = firestore.batch();
            
            batch.update(chatsRef, {
                usersHasRead: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email, hasRead: hasRead, chatIsSelected: chatIsSelected})
            });
            batch.update(chatsRef, {
                usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                    email: state.user.email, hasRead: true, chatIsSelected: true})
            });
            
            /* PREVIOUS SELECTED CHAT HANDLER */
            /* after user selects a new chat, update chatIsSelected of previous chat
            (to false) */
            if(state.home.selectedChat != null){
                var prevChatsRef = firestore.collection("chats").doc(state.home.chats[state.home.selectedChat].id);
                batch.update(prevChatsRef, {
                    usersHasRead: firebase.firestore.FieldValue.arrayRemove({
                        email: state.user.email, hasRead: true, chatIsSelected: true})
                });
                batch.update(prevChatsRef, {
                    usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                        email: state.user.email, hasRead: true, chatIsSelected: false})
                });
            };

            batch.commit()
                .then(() => console.log('Success!'))
                .catch(err => console.error('Failed!', err));
        }
        dispatch({ 
            type: "SET_SELECTED_CHAT", 
            payload: chatIndex 
        });    
    };

    useEffect(() => {
        console.log(state.home.selectedChat);
        updateAvatars();
    }, [state.home.selectedChat]);

    const updateAvatars = () => {
        if (!(state.home.selectedChat === null)) {
            console.log("UPDATEAVATARS: ", state.home.chats);
            if (
                state.home.chats.length !== 0 &&
                state.home.chats !== undefined
            ) {
                var i = 0;
                // console.log(state.home.chats[state.home.selectedChat]);
                let chatUsers = state.home.chats[state.home.selectedChat].users;

                for (i; i < Object.keys(chatUsers).length; i++) {
                    let email = chatUsers[i];
                    if (!(email in state.home.loadedAvatars)) {
                        firestore
                            .collection("users")
                            .doc(email)
                            .get()
                            .then((res) => {
                                let temp = state.home.loadedAvatars;
                                temp[email] = res.data().avatar;
                                dispatch({
                                    type: "SET_AVATARS",
                                    payload: temp,
                                });
                            });
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (state.user.email !== null) {
            let temp;
            firestore
                .collection("users")
                .doc(state.user.email)
                .get()
                .then((res) => {
                    if(res.data() != null){
                        temp = state.home.loadedAvatars;
                    temp[state.user.email] = res.data().avatar;
                    dispatch({
                        type: "SET_AVATARS",
                        payload: temp,
                    });
                    }
                    
                });
        }
    }, [state.user.email]);

    // auto close alert
    useEffect(() => {
        if(state.display.showAlert === true){
            async function autoClose(){
                try{
                    await delay(4000);
                    dispatch({
                        type: "SET_SHOW_ALERT",
                        payload: false,
                    });
                }catch(e){
                    console.error(e);
                }
            }
            autoClose();
        }
    }, [state.display.showAlert]);
    
    /* create delay to ensure dialog sliding animation */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    /* control opening and closing (with a 0.5s delay) of dialog */
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = async () => {
        setOpen(false);
        await delay(500);
    };

    const classes = useStyles();
    return (
        <>
            <AlertComponent
                // type='logged in'
                // message='Successfully logged in.'    
            />
            {console.log("STATEUSERNAME: ", state.user.name)}
            <div style={{
                    position: 'fixed',
                    zIndex: 1,
                    top: '50vh',
                    left: '50vw',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <BeatLoader color='#184A46' loading={state.display.loading} css={override} size={15} />
            </div>
            <div>
                <NavBarComponent 
                    history={history} 
                    //receivedCount={receivedCount} 
                />
            </div>
            <div
                id="outer-container"
                style={{
                    height: "93vh",
                    width: "100vw",
                    display: "flex",
                    overflowY: 'hidden'
                    // borderWidth: 1,
                    // borderStyle: "solid",
                    // backgroundColor: this.props.theme.backgroundColor
                }}
            >
                {/* Left Section (ChatList) */}
                <Slide timeout={{enter: '0ms'}}  direction="right" in={true} mountOnEnter unmountOnExit>
                <div
                    style={{
                        height: "93vh",
                        width: 326,
                        minWidth: 326,
                        // width:'17vw',
                        // width: "325px"
                        // borderWidth: 1,
                        // borderStyle: "solid",
                        // borderColor: "black",
                        borderRight:'1px solid grey',
                        background:
                            "linear-gradient(0deg, rgba(137,161,143,1) 100%, rgba(253,187,45,1) 100%)",
                        color: "#424242",
                    }}
                >
                        {/* Profile / Logout / Create chat */}
                        <Grid
                            container
                            spacing = {3}
                            style={{flexFlow: 1, overflow: "hidden", maxWidth: "107%", paddingBottom: "10%"}}
                        >   
                            {/*profile + username */}
                            <Slide timeout={{enter: '1000ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
                                <Grid item xs={12} style={{paddingLeft: "12.5%", paddingRight: "5%", paddingTop: "10%"}}>
                                    <Link 
                                        to="profile"
                                    >
                                        <Button 
                                            variant="outlined"
                                            style={{ 
                                                color: "black",
                                                borderRadius: 5, 
                                                borderColor: "black",
                                                width: "90%", 
                                                height: "100%",
                                                fontSize: 30
                                            }}
                                            startIcon={
                                                <StyledBadge
                                                    overlap="circle"
                                                    anchorOrigin={{
                                                        vertical: "bottom",
                                                        horizontal: "right",
                                                    }}
                                                    variant="dot"
                                                >
                                                    <Avatar 
                                                        alt="Remy Sharp"
                                                        src={state.home.loadedAvatars[state.user.email]}
                                                        className={classes.large}
                                                    />
                                                </StyledBadge>
                                            }
                                        >
                                            {/* {
                                                <div style={{fontSize: 30}}>
                                                    {state.user.username}
                                                </div>
                                            } */}
                                        {state.user.username}
                                        </Button>
                                    </Link>
                                </Grid>
                            </Slide>
                            {/*CREATE + INVITE + NOTIFICATION buttons*/}
                            <Slide timeout={{enter: '1000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                                <Grid 
                                    container 
                                    justify='center'
                                    alignItems='center' 
                                    spacing={2}  
                                >
                                    {/*create chat button*/}
                                    <Grid item >
                                        <Button 
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            size="medium"
                                            onClick={() => {
                                                /* show the createChat component 
                                                as well as showing the actual
                                                createChat dialog */ 
                                                dispatch({
                                                    type: "SET_SHOW_CHAT_CREATE",
                                                    payload: true,
                                                })
                                                handleClickOpen();
                                            }}
                                            style={{background: "#89A18F"}}
                                        >
                                            Create
                                        </Button>
                                        {state.display.showChatCreate ? (
                                            <CreateChat
                                                showCreateChat={open}
                                                closeCreateChat={async() => {
                                                    /* on dialog closing, wait for 
                                                    handleClose() before closing the
                                                    createChat component  */
                                                    await handleClose();
                                                    dispatch({
                                                        type: "SET_SHOW_CHAT_CREATE",
                                                        payload: false,
                                                    })
                                                }}
                                                createChat={createChat}
                                            />
                                        ) : null}
                                    </Grid>
                                    {/*Invite button */}
                                    <Grid item>
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            startIcon={<PersonAddSharpIcon />}
                                            onClick={() =>{
                                                /* show the chatInvite component 
                                                as well as showing the actual
                                                chatInvite dialog */ 
                                                dispatch({
                                                    type: "SET_SHOW_CHAT_INVITE",
                                                    payload: true,
                                                });
                                                handleClickOpen();
                                            }}
                                            style={{background: "#89A18F"}}
                                        >
                                            Invite
                                        </Button>
                                        {/* display on click */}
                                        {state.display.showChatInvite ? (
                                            <ChatInvite
                                                showChatInvite={open}
                                                closeChatInvite={async () =>{
                                                    /* on dialog closing, wait for 
                                                    handleClose() before closing the
                                                    chatInvite component  */
                                                    await handleClose();  
                                                    dispatch({
                                                        type: "SET_SHOW_CHAT_INVITE",
                                                        payload: false,
                                                    })
                                                }}
                                                chats={state.home.chats}
                                                email={state.user.email}
                                            />
                                        ) : null}
                                    </Grid>
                                    {/*Notification button*/}
                                    <Grid item >
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            onClick={() =>{
                                                /* show the chatAccept component 
                                                as well as showing the actual
                                                chatAccept dialog */ 
                                                dispatch({
                                                    type: "SET_SHOW_CHAT_ACCEPT",
                                                    payload: true,
                                                });
                                                handleClickOpen();
                                            }}
                                            startIcon={<Badge style={{paddingLeft: "40%"}} badgeContent={state.home.chatInviteCount} color="secondary">
                                            <PlaylistAddCheckIcon />
                                            </Badge>}
                                            style={{background: "#89A18F"}}
                                        >
                                        </Button>
                                        {/* display notification on click */}
                                        {state.display.showChatAccept ? (
                                            <ChatAcceptComponent
                                                showChatAccept={open}
                                                closeChatAccept={async() =>{
                                                    /* on dialog closing, wait for 
                                                    handleClose() before closing the
                                                    chatAccept component  */
                                                    await handleClose();
                                                    dispatch({
                                                        type: "SET_SHOW_CHAT_ACCEPT",
                                                        payload: false,
                                                    })
                                                }}
                                                email={state.user.email}
                                                username={state.user.username}
                                            />
                                        ) : null}
                                    </Grid>
                                </Grid>
                            </Slide>
                        </Grid>
                    
                    {/*separator line */}
                    
                    {/* Chatroom list (ChatList) + Friend list (FriendList) */}
                    <Slide timeout={{enter: '1000ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
                    <div
                        style={{
                            // overflowX:"hidden",
                            width: "100%",
                            height: "78%",
                            scrollbarColor: "#424242 #89A18F"
                            //paddingTop: "100px"
                            // borderWidth: 1,
                            // borderStyle: "solid",
                        }}
                    >
                        <AppBar 
                            position="static"
                            style={{background: "#89A18F"}}
                        >
                            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                                <Tabs  TabIndicatorProps={{style: {height: '5px',backgroundColor:'#184A46'}}} 
                                    centered 
                                    value={value} 
                                    onChange={handleChange} 
                                    aria-label="simple tabs example"
                                >
                                    <Tab 
                                        style={{color: 'black', minWidth:'50%'}} 
                                        label='Chats' 
                                        icon={<ChatIcon style={{fill: "black"}}/>} />
                                    <Tab 
                                        style={{color: 'black', minWidth:'50%'}} 
                                        label='Friends' 
                                        icon={<PeopleIcon style={{fill: "black"}}/>}  />
                                </Tabs>
                            </Slide>
                            
                        </AppBar>

                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChange}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction} >
                                <ChatsListComponent
                                    chatsList={state.home.chats}
                                    selectFunction={selectChat}
                                    loadedAvatars={state.home.loadedAvatars}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                <FriendsListComponent
                                    selectFunction={selectChat}
                                    // width="16vw"
                                    width='100%'  
                                />
                            </TabPanel>
                        </SwipeableViews>
                        
                    </div>
                    </Slide>
                </div>
                </Slide>
                {/* Right Section (ChatView) */}
                {state.home.selectedChat < 0 ? (
                    <div>No chat selected...</div>
                ) : (
                    <ChatViewComponent
                        chat={state.home.chats[state.home.selectedChat]}
                        email={state.user.email}
                        username={state.user.username}
                        avatars={state.home.loadedAvatars}
                        roomName={state.home.chats[state.home.selectedChat]}

                    />
                )}
            </div>
        </>
    );
};

export default HomeComponent;
