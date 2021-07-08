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

    // if (chatsList.length > 0) {
        // If the user is in at least one chat
        var groupchats = chatsList.filter((chat) => chat.type ==='groupchat');
        var directChats = chatsList.filter((chat) => chat.type ==='1on1');
        return (
            <List
                style={{margin:'auto'}}
                // style={{margin:'auto',overflow:'auto', height: '50vh', scrollbarWidth: 'thin'}}
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
                    <List component="div" disablePadding>
                        {groupchats.map((chat, index) => {
                                // var chatType = 
                                //     chat.type === "groupchat" ? "groupchat" : "1on1";
                                // var avatar = 
                                //     chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                //         : chat.owner;
                                // var chatName = 
                                //     chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                //         : chat.name;
                                // create a list item for each chat by mapping over the chatsList passed in from props
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
                                                            <div style={{fontSize:14}}>
                                                                    {chatsList.indexOf(chat)}
                                                                </div>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {userHasRead(chat) 
                                                        ? null 
                                                        : (
                                                            <FiberManualRecordIcon style={{float:'right'}}/>
                                                    )}
                                                </Grid>
                                            </Grid>
                                                
                                            {/* <ListItemText primary={chatName} secondary={chatsList.indexOf(chat)} /> */}
                                            
                                            {/* <div style={{marginLeft: 100}}>
                                            {userHasRead(chat) ? null : (
                                                <FiberManualRecordIcon/>
                                            )}
                                            </div> */}
                                        </ListItem>
                                    </div>
                                );
                            })}
                    </List>
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
                        {directChats.map((chat, index) => {
                            // var chatType = 
                            //     chat.type === "groupchat" ? "groupchat" : "1on1";
                            var avatar = chat.users.filter((email) => email != state.user.email);
                                // chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                //     : chat.avatar;
                            var username = chat.usernames.filter((email) => email != state.user.username);
                            var userEmail = chat.users.filter((email) => email != state.user.email);

                                // chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
                                //     : chat.name;
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
                                                        <div style={{fontSize:14}}>
                                                            {/* {chatsList.indexOf(chat)} */}
                                                            {userEmail}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                    
                                            </Grid>
                                            <Grid item xs={1}>
                                                {userHasRead(chat) 
                                                ? null 
                                                : (
                                                    <FiberManualRecordIcon style={{float:'right'}}/>
                                                )}
                                            </Grid>
                                        </Grid>
                                        
                                        {/* <ListItemText 
                                            style={{overflow:'hidden'}}
                                            primary={chatName} 
                                            secondary={chatsList.indexOf(chat)}   
                                        /> */}
                                        {/* <div style={{ overflow: "hidden", display:'block' ,textOverflow: "ellipsis" }}>
                                           {chatName}
                                           <div style={{fontSize:14}}>
                                               {chatsList.indexOf(chat)}
                                           </div>
                                        </div>
                                        
                                        
                                        {userHasRead(chat) ? null : (
                                            <FiberManualRecordIcon  />
                                        )} */}
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </Collapse>
            </List>


        //    <Collapse in={openDirectChat} timeout="auto" unmountOnExit>
        //             <List component="div" disablePadding>
        //                 {console.log("LOADEDAVATARS:", loadedAvatars)}

        //                 {directChats.map((chat, index) => {
        //                     var chatType = 
        //                         chat.type === "groupchat" ? "groupchat" : "1on1";
        //                     var avatar = 
        //                         chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
        //                             : chat.owner;
        //                     var chatName = 
        //                         chat.type != "groupchat" ? chat.users.filter((email) => email != state.user.email)
        //                             : chat.name;
        //                     // create a list item for each chat by mapping over the chatsList passed in from props
        //                     return (
        //                         // create a listitem for each chat the user is in
        //                         <div key={index}>
        //                             <ListItem
        //                                 onClick={() => {
        //                                     dispatch({ 
        //                                         type: "SET_SELECTED_DIRECTCHATS_INDEX", 
        //                                         payload: index 
        //                                     });
        //                                     dispatch({ 
        //                                         type: "SET_SELECTED_GROUPCHATS_INDEX", 
        //                                         payload: null 
        //                                     });
        //                                     selectFunction(chatsList.indexOf(chat));
        //                                 }}
        //                                 divider
        //                                 button
        //                                 selected={state.home.selectedDirectChatsIndex===index}
        //                             >
        //                                 <ListItemAvatar>
        //                                     <Avatar
        //                                         alt="Remy Sharp"
        //                                         src={loadedAvatars[avatar]}
        //                                     >
        //                                         {/* {chatName.split("")[0]} */}
        //                                     </Avatar>
        //                                 </ListItemAvatar>
        //                                 <ListItemText primary={chatName} secondary={chatsList.indexOf(chat)} />
        //                                 {userHasRead(chat) ? null : (
        //                                     <FiberManualRecordIcon  />
        //                                 )}
        //                             </ListItem>
        //                         </div>
        //                     );
        //                 })}
        //             </List>
        //         </Collapse>
        );
    // } else {
    //     // If the user is not in any chats
    //     return (
    //         <div style={{ textAlign: "center" }}>You have no chatrooms!</div>
    //     );
    // }
};

export default ChatsListComponent;
