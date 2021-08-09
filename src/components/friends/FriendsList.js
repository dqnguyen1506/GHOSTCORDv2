import React, { useEffect, useContext, useState } from "react";
import { auth, firestore } from "../../api-config/fire";
import firebase from "firebase/app";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { GlobalContext } from "../../global-context/State";
import {
    List,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    ListItemSecondaryAction,
    IconButton,
    Badge,
    Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatIcon from '@material-ui/icons/Chat';
import {GoToChatComponent} from "../groupchat/goToChat";

/* custom Badge (w/o animation) for user OFFLINE status */
const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "gray",
        color: "gray",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
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

/* custom Badge (with animation) for user ONLINE status */
const StyledBadge2 = withStyles((theme) => (
    {
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

const FriendsListComponent = ({selectFunction, width}) => {
    /* a delay variable */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    // global context
    const { state, dispatch } = useContext(GlobalContext);
    // list of user's friends objects
    const [friends, setFriends] = useState([]);
    // variable to open goToChat component
    const [open, setOpen] = useState(false);
    // handler for closing goToChat component
    const handleClose = async () => {
        setOpen(false);
        await delay(500);
    };
    //upon deleting a friend from user's friend list...
    const deleteFriend = async(email, name) => {
        //if an alert is opened already, close it
        if(state.display.showAlert === true){
            await dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        };
        // update alert information to be displayed
        if(state.alert.type !== 'deleted'){
            await dispatch({
                type: "SET_ALERT_TYPE",
                payload: 'deleted',
            });
        };
        if(state.alert.message !== 'User removed from Friends'){
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'User removed from Friends!',
            });
        };
        // update user's friends list (remove selected user from list)
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                friends: firebase.firestore.FieldValue.arrayRemove({
                    email: email,
                    name: name,
                }),
            })
            .catch(error =>{
                console.log(`Error during removal of selected user from friends list on Firebase: `, error)
            })
        // update the selected user's friend list (remove the current user from list)
        await firestore
            .collection("users")
            .doc(email)
            .update({
                friends: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .catch(error =>{
                console.log(`Error during your removal from selected user' friends list on Firebase: `, error)
            })
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });
    };
    /* store new chat infomation in database */
    const createChat = async (name, email) => {
        await firestore
            .collection("chats")
            .add({
                type: "1on1",
                messages: [],
                invited: [],
                users: [state.user.email, email],
                usernames: [state.user.username, name],
                owner: null,
                id: null,
            })
            .then(async (res) => {
                await firestore.collection("chats").doc(res.id).update({
                    id: res.id,
                    usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                        email: state.user.email, 
                        hasRead: false, 
                        chatIsSelected: false},
                        
                        {email: email, 
                            hasRead: false, 
                            chatIsSelected: false}
                        )
                });
            })
            .catch((err) => {
                console.log("Error creating room: %s", err.code);
            });
    }

    /* handle chat with selected friend */
    const goToChat = async (name, email) => {
        /* check if the 1-on-1/direct messaging chat existed */
        let directChats = state.home.chats.filter((chat) => chat.type ==='1on1');
        let res = state.home.chats.filter((chat) => 
            chat.users.includes(email) && 
            chat.users.includes(state.user.email) && 
            chat.type === '1on1');
        /* if it exists go to chat */
        if (res.length === 1){
            let index = state.home.chats.indexOf(res[0]);
            await selectFunction(index);
            await dispatch({ 
                type: "SET_SELECTED_DIRECTCHATS_INDEX", 
                payload: directChats.indexOf(res[0]) 
            });
            if(state.home.selectedGroupChatsIndex !== null){
                dispatch({ 
                    type: "SET_SELECTED_GROUPCHATS_INDEX", 
                    payload: null 
                });
            }
        }
        /* if it doesn't exist, create one and prompt dialog to open goToChat component*/
        else{
            await createChat(name, email);
            dispatch({ 
                type: "SET_SHOW_GO_TO_CHAT", 
                payload: true
            });  
            dispatch({ 
                type: "SET_FRIEND_NAME", 
                payload: name
            }); 
            dispatch({ 
                type: "SET_FRIEND_EMAIL", 
                payload: email
            }); 
        }
        
    };
    // update local friends list upon relogging
    useEffect(() => {
        firestore
            .collection("users")
            .where("email", "==", state.user.email)
            .get()
            .then((res) => {
                setFriends(res.docs[0].data().friends);         
            });
       
    }, [state.user.email, state.user.friends]);

    //open goToChat component upon new direct messages chat
    useEffect(() => {
        if(state.display.showGoToChat === true){
            setOpen(true);
        }
    }, [state.display.showGoToChat]);

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
    
    return (
        <div>
            <Grid 
                container
                direction='column'
                justify='center'
                alignItems='center'
            >
                {/* friends list */}
                <List style = {{width: `${width} `}}>
                    {friends !== undefined ? (
                        friends.map((users, index) => {
                            return (
                                <>
                                        <ListItem 
                                            key={index}
                                            style={{height:75}}>
                                                {/* if friend is ONLINE, display online badge w/ avatar */}
                                                {state.home.statuses[users.email] === "online" ?
                                                    <React.Fragment>
                                                        <ListItemAvatar>
                                                            <StyledBadge2
                                                                style={{ }}
                                                                overlap="circle"
                                                                anchorOrigin={{
                                                                vertical: "bottom",
                                                                horizontal: "right",
                                                                }}
                                                                variant="dot"
                                                            >
                                                                <Avatar
                                                                    src={
                                                                        state.home.loadedAvatars[
                                                                            users.email
                                                                        ]
                                                                    }
                                                                />
                                                            </StyledBadge2>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={users.name} secondary = {"online"} />
                                                    </React.Fragment>   
                                                : 
                                                    <React.Fragment>
                                                        {/* if friend is offline, display offline badge w/ avatar */} 
                                                        <ListItemAvatar>
                                                            <StyledBadge
                                                                style={{ }}
                                                                overlap="circle"
                                                                anchorOrigin={{
                                                                vertical: "bottom",
                                                                horizontal: "right",
                                                                }}
                                                                variant="dot"
                                                            >
                                                                <Avatar
                                                                    src={
                                                                        state.home.loadedAvatars[
                                                                            users.email
                                                                        ]
                                                                    }
                                                                />
                                                            </StyledBadge>
                                                    
                                                        </ListItemAvatar>
                                                        {/* friend username + online status */}
                                                        <ListItemText primary={users.name} secondary = {"offline"} />
                                                    </React.Fragment>   
                                                }
                                                <ListItemSecondaryAction>
                                                    {/* for friends list displayed in Friends tab, there is a delete button */}
                                                    {width === "50vw" ? (
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() =>
                                                                deleteFriend(
                                                                    users.email,
                                                                    users.name
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    ) : 
                                                        <React.Fragment>
                                                            {/* for friends list displayed in main chat page, there is a chat button */}
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="goToChat"
                                                                onClick={() => {
                                                                    goToChat(users.name, users.email);
                                                                    
                                                                }}
                                                            >
                                                                <ChatIcon />
                                                            </IconButton> 
                                                            {/* display goToChat component upon selecting chat button */}
                                                            {state.display.showGoToChat ? (
                                                                <GoToChatComponent
                                                                    selectFunction={selectFunction}
                                                                    name = {state.friend.name}
                                                                    email = {state.friend.email}
                                                                    showGoToChat={open}
                                                                    closeGoToChat={async () =>{
                                                                        /* on dialog closing, wait for 
                                                                        handleClose() before closing the
                                                                        chatInvite component  */
                                                                        await handleClose();  
                                                                        dispatch({
                                                                            type: "SET_SHOW_GO_TO_CHAT",
                                                                            payload: false,
                                                                        })
                                                                    }}
                                                                />
                                                            ): null}
                                                        </React.Fragment>
                                                    
                                                    } 
                                                    
                                                </ListItemSecondaryAction>
                                        </ListItem>
                                    
                                    
                                    <Divider />
                                </>
                            );
                        })
                    ) : (
                        <div>
                            <em>Add some friends!</em>
                        </div>
                    )}
                </List>
            </Grid>
        </div>
    );
};

export default FriendsListComponent;
