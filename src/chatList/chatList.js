import React, {useContext, useState} from "react";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles
} from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { GlobalContext } from "../state/State.js";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { AnimatedList } from 'react-animated-list';

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

    if (chatsList.length > 0) {
        // If the user is in at least one chat
        var groupchats = chatsList.filter((chat) => chat.type ==='groupchat');
        var directChats = chatsList.filter((chat) => chat.type ==='1on1');
        return (
            <List
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
                    {/* <List component="div" disablePadding>
                        <ListItem button style={{paddingLeft: '2vw'}}>
                            <ListItemText primary="Starred" />
                        </ListItem>
                    </List> */}
                    <AnimatedList animation={"grow"}>
                        {groupchats.map((chat, index) => {
                                var chatType = 
                                    chat.type === "groupchat" ? "groupchat" : "1on1";
                                var avatar = 
                                    chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                        : chat.owner;
                                var chatName = 
                                    chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                        : chat.name;
                                // create a list item for each chat by mapping over the chatsList passed in from props
                                return (
                                    // create a listitem for each chat the user is in
                                    <div key={index}>
                                        <List component="div" disablePadding>
                                        <ListItem
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
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    src={loadedAvatars[avatar]}
                                                >
                                                    {/* {chatName.split("")[0]} */}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={chatName} secondary={chatsList.indexOf(chat)} />
                                            {userHasRead(chat) ? null : (
                                                <FiberManualRecordIcon  />
                                            )}
                                        </ListItem>
                                        </List>
                                    </div>
                                );
                            })}
                    </AnimatedList>
                    {/* <List component="div" disablePadding>
                        {console.log("LOADEDAVATARS:", loadedAvatars)}
                        
                    </List> */}
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
                        {console.log("LOADEDAVATARS:", loadedAvatars)}

                        {directChats.map((chat, index) => {
                            var chatType = 
                                chat.type === "groupchat" ? "groupchat" : "1on1";
                            var avatar = 
                                chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                    : chat.owner;
                            var chatName = 
                                chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                    : chat.name;
                            // create a list item for each chat by mapping over the chatsList passed in from props
                            return (
                                // create a listitem for each chat the user is in
                                <div key={index}>
                                    <ListItem
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
                                        <ListItemAvatar>
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={loadedAvatars[avatar]}
                                            >
                                                {/* {chatName.split("")[0]} */}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={chatName} secondary={chatsList.indexOf(chat)} />
                                        {userHasRead(chat) ? null : (
                                            <FiberManualRecordIcon  />
                                        )}
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </Collapse>
            </List>


            // <List>
            //     {console.log("LOADEDAVATARS:", loadedAvatars)}

            //     {chatsList.map((chat, index) => {
            //         var chatType = 
            //             chat.type === "groupchat" ? "groupchat" : "1on1";
            //         var avatar = 
            //             chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
            //                 : chat.owner;
            //         var chatName = 
            //             chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
            //                 : chat.name;
            //         // create a list item for each chat by mapping over the chatsList passed in from props
            //         return (
            //             // create a listitem for each chat the user is in
            //             <div key={index}>
            //                 <ListItem
            //                     onClick={() => {
            //                         selectFunction(index);
            //                        }
            //                     }
            //                     divider
            //                     button
            //                     selected={state.home.selectedChat===index}
            //                 >
            //                     <ListItemAvatar>
            //                         <Avatar
            //                             alt="Remy Sharp"
            //                             src={loadedAvatars[avatar]}
            //                         >
            //                             {/* {chatName.split("")[0]} */}
            //                         </Avatar>
            //                     </ListItemAvatar>
            //                     <ListItemText primary={chatName} secondary={chatType} />
            //                     {userHasRead(chat) ? null : (
            //                         <FiberManualRecordIcon  />
            //                     )}
            //                 </ListItem>
            //             </div>
            //         );
            //     })}
            // </List>
        );
    } else {
        // If the user is not in any chats
        return (
            <div style={{ textAlign: "center" }}>You have no chatrooms!</div>
        );
    }
};

export default ChatsListComponent;
