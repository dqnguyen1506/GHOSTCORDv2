import React, { useEffect, useContext, useState } from "react";
import { auth, firestore } from "../config/fire";
import firebase from "firebase/app";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { GlobalContext } from "../state/State";
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
import { AnimatedList } from 'react-animated-list';
import AlertComponent from '../groupchat/Alert';

const FriendsListComponent = ({selectFunction, width}) => {
    /* create delay to ensure dialog sliding animation */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const { state, dispatch } = useContext(GlobalContext);
    const [friends, setFriends] = useState([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    
    const handleClose = async () => {
        setOpen(false);
        await delay(500);
    };

    const deleteFriend = async(email, name) => {
        if(state.display.showAlert === true){
            await dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        };
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
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                friends: firebase.firestore.FieldValue.arrayRemove({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                friends: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .then(() => {});
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });

        // firestore
        //     .collection("users")
        //     .where("email", "==", state.user.email)
        //     .get()
        //     .then((res) => {
        //         setFriends(res.docs[0].data().friends);
        //         var friends = res.docs[0].data().friends;
        //             var loopData = ''
        //             for(var x in friends){
        //                 const email = friends[x].email;
        //                 loopData += `${email} `
        //             }
        //             dispatch({ 
        //                 type: "SET_FRIENDS", 
        //                 payload: loopData.split(" ")
        //             });
        //     });
            
    };
    /* store new chat infomation in database */
    const createChat = async (name, email) => {
        setName(email);
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
        /* check if the 1-on-1 chat existed */
        let directChats = state.home.chats.filter((chat) => chat.type ==='1on1');
        let res = state.home.chats.filter((chat) => 
            chat.users.includes(email) && 
            chat.users.includes(state.user.email) && 
            chat.type === '1on1');
        /* if it exists go to chat */
        if (res.length === 1){
            let index = state.home.chats.indexOf(res[0]);
            selectFunction(index);
            dispatch({ 
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
        /* if it doesn't exist, create one and prompt dialog to go to chat*/
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
    useEffect(() => {
        firestore
            .collection("users")
            .where("email", "==", state.user.email)
            .get()
            .then((res) => {
                setFriends(res.docs[0].data().friends);   
                // setFriends([...friends, res.docs[0].data().friends]);      
            });
       
    }, [state.user.email, state.user.friends]);

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
    
    /* Badge (w/o animation) for user OFFLINE status */
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

    /* Badge (with animation) for user ONLINE status */
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


    return (
        <div>
            <Grid 
                container
                direction='column'
                justify='center'
                alignItems='center'
            >
                {/* <AlertComponent
                type='success' 
                message='User removed from Friends!'   
            /> */}
                {/* <AnimatedList animation={"grow"}> */}
                <List style = {{width: `${width} `}}>
                    {friends !== undefined ? (
                        friends.map((users, index) => {
                            return (
                                <>
                                    {/* <List style = {{width: `${width} `}}> */}
                                        <ListItem 
                                            key={index}
                                            style={{height:75}}>
                                            {/* <GoToChatComponent
                                                selectFunction={selectFunction}
                                                name = {name}
                                                email = {email}
                                            >
                            
                                            </GoToChatComponent> */}
                                                {/* if friend is online, display online badge */}
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
                                                        {/* if friend is offline, display offline badge */} 
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
                                                        <ListItemText primary={users.name} secondary = {"offline"} />
                                                    </React.Fragment>   
                                                }
                                                <ListItemSecondaryAction>
                                                    {/* <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => sendRequest(users.email)}
                                            >
                                                <AddIcon />
                                            </IconButton> */}
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
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="goToChat"
                                                                onClick={() => {
                                                                    goToChat(users.name, users.email);
                                                                    
                                                                }}
                                                            >
                                                                <ChatIcon />
                                                            </IconButton> 
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
                {/* </AnimatedList> */}
                </List>
            </Grid>
        </div>
    );
};

export default FriendsListComponent;
