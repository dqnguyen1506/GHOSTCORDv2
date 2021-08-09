import React, {useContext, useState} from "react";
import {
    Avatar,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Slide
} from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { GlobalContext } from "../../global-context/State.js";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { AnimatedList } from 'react-animated-list';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';

const useStyles = makeStyles((theme) => ({
    title: {
        color: 'black'
    },
}));


const ChatsListComponent = ({ chatsList, selectFunction, loadedAvatars }) => {
    const classes = useStyles();
    const { state, dispatch } = useContext(GlobalContext);
    const [openGroupChat, setOpenGroupChat] = useState(true);
    const [openDirectChat, setOpenDirectChat] = useState(true);
    const [selectedGroupChatIndex, setSelectedGroupChatIndex] = useState(null);
    const [selectedDirectChatIndex, setSelectedDirectChatIndex] = useState(null);
    const handleClick = (type) => () => {
        if(type === 'groupchat'){
            setOpenGroupChat(!openGroupChat);
        }else{
            setOpenDirectChat(!openDirectChat);
        }
    };
    const handleListItemClick = (type,index) => {
        if(type === 'groupchat'){
            setSelectedGroupChatIndex(index);
            setSelectedDirectChatIndex(null);
        }else{
            setSelectedDirectChatIndex(index);
            setSelectedGroupChatIndex(null);
        }
    };
    const userHasRead = chat => {
        var hasRead = false;
        for(var x in chat.usersHasRead){
            if(chat.usersHasRead[x].email === state.user.email){
                hasRead = chat.usersHasRead[x].hasRead;
            }
        }
        return hasRead
    };
        var groupchats = chatsList.filter((chat) => chat.type ==='groupchat');
        var directChats = chatsList.filter((chat) => chat.type ==='1on1');
        return (
            <List
                style={{margin:'auto'}}
                component="nav"
            >
                {/* group chats */}
                <ListItem button  onClick={handleClick("groupchat")} >
                    <ListItemText 
                        primary={`Group chats (${groupchats.length})`} 
                        className={classes.title}
                    />
                    {openGroupChat ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openGroupChat} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {groupchats.map((chat, index) => {
                                // messages sent by all recipients
                                var recipientsMessages = chat.messages.filter(message => message.senderUsername != state.user.username)
                                var chatPreviewColor = userHasRead(chat) 
                                    ? ""
                                    : "red";
                                return (
                                    // create a listitem for each chat the user is in
                                    <div key={index}>
                                        <ListItem
                                            style={{height:75}}
                                            onClick={() => {
                                                dispatch({ 
                                                    type: "SET_SELECTED_GROUPCHATS_INDEX", 
                                                    payload: index 
                                                });
                                                dispatch({ 
                                                    type: "SET_SELECTED_DIRECTCHATS_INDEX", 
                                                    payload: null 
                                                });
                                                selectFunction(chatsList.indexOf(chat));
                                            }}
                                            divider
                                            button
                                            selected={state.home.selectedGroupChatsIndex===index}
                                        >
                                            <Grid
                                                container
                                                alignItems='center'
                                                direction='row'
                                                spacing={3}
                                            >
                                                <Grid item xs={2} style={{float:'left'}}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt="Remy Sharp"
                                                            src={chat.avatar}
                                                        >
                                                            {/* {chatName.split("")[0]} */}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Grid 
                                                        container
                                                        direction='column'
                                                        alignItems='flex-start'
                                                        justify='center'
                                                    >
                                                        <Grid item xs>
                                                            <div style={{ fontSize:16, overflow: "hidden" ,textOverflow: "ellipsis" }}>
                                                                {chat.name}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div style={{fontSize:14, color: `${chatPreviewColor}`}}>
                                                                    {/* {chatsList.indexOf(chat)} */}
                                                                    {recipientsMessages.length > 0 
                                                                        ? recipientsMessages[recipientsMessages.length - 1].message === "New Chat Member Alert" 
                                                                            ? `${recipientsMessages[recipientsMessages.length - 1].message} has been added!`
                                                                            :  `${recipientsMessages[recipientsMessages.length - 1].senderUsername}: ${recipientsMessages[recipientsMessages.length - 1].message}`
                                                                        : "No Messages Sent Yet!"
                                                                    }
                                                                </div>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {userHasRead(chat) 
                                                        ? null 
                                                        : (
                                                            <NotificationImportantIcon style={{color: 'red', float:'right'}}/>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </div>
                                );
                            })}
                    </List>
                </Collapse>

                {/* direct messages */}
                <ListItem button onClick={handleClick("1on1")}>
                    <ListItemText 
                        primary={`Direct Messages (${directChats.length})`} 
                        className={classes.title}    
                    />
                    {openDirectChat ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDirectChat} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {directChats.map((chat, index) => {
                        
                            var avatar = chat.users.filter((email) => email != state.user.email);
                              
                            var username = chat.usernames.filter((email) => email != state.user.username);
                            var userEmail = chat.users.filter((email) => email != state.user.email);
                            // filter out all messages sent by recipient
                            var recipientMessages = chat.messages.filter(message => message.senderUsername != state.user.username)
                            var chatPreviewColor = userHasRead(chat) 
                                ? ""
                                : "red";
                            // create a list item for each chat by mapping over the chatsList passed in from props
                            return (
                                // create a listitem for each chat the user is in
                                <div key={index}>
                                    <ListItem
                                        style={{height:75}}
                                        onClick={() => {
                                            dispatch({ 
                                                type: "SET_SELECTED_DIRECTCHATS_INDEX", 
                                                payload: index 
                                            });
                                            dispatch({ 
                                                type: "SET_SELECTED_GROUPCHATS_INDEX", 
                                                payload: null 
                                            });
                                            selectFunction(chatsList.indexOf(chat));
                                        }}
                                        divider
                                        button
                                        selected={state.home.selectedDirectChatsIndex===index}
                                    >
                                        <Grid
                                            container
                                            alignItems='center'
                                            direction='row'
                                            spacing={3}
                                        >
                                            <Grid item xs={2} style={{float:'left'}}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt="Remy Sharp"
                                                        src={loadedAvatars[avatar]}
                                                    >
                                                        {/* {chatName.split("")[0]} */}
                                                    </Avatar>
                                                </ListItemAvatar>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Grid 
                                                    container
                                                    direction='column'
                                                    alignItems='flex-start'
                                                    justify='center'
                                                >
                                                    <Grid item xs>
                                                        <div style={{fontSize:16, overflow: "hidden" ,textOverflow: "ellipsis" }}>
                                                            {username}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <div style={{fontSize:14, color: `${chatPreviewColor}`}}>
                                                            {/* {chatsList.indexOf(chat)} */}
                                                            {/* {userEmail} */}
                                                            {recipientMessages.length > 0 
                                                                        ? `${recipientMessages[recipientMessages.length-1].message}`
                                                                        : "No Messages Sent Yet!"
                                                            }
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                    
                                            </Grid>
                                            <Grid item xs={1}>
                                                {userHasRead(chat) 
                                                ? null 
                                                : (
                                                    <NotificationImportantIcon style={{color: 'red', float:'right'}}/>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </Collapse>
            </List>
        );
};

export default ChatsListComponent;
