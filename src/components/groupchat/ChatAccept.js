import React, { useState, useEffect, useContext } from "react";
import {
    List,
    Dialog,
    ListItem,
    ListItemAvatar,
    DialogTitle,
    ListItemText,
    Avatar,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    DialogContentText,
    Button,
    Zoom,
    Slide
} from "@material-ui/core";
import { 
    makeStyles, 
    ThemeProvider,
    createMuiTheme,
    withStyles
} from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import { firestore } from "../../api-config/fire";
import firebase from "firebase/app";
import { GlobalContext } from "../../global-context/State";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom direction="right" ref={ref} {...props} />;
  });
const zoomProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 800, exit: 800 }
};
const acceptInvite = async (chat, email, setAcceptError, username) => {
    setAcceptError(null);
    await firestore
        .collection("chats")
        .doc(chat.id)
        .update({ 
            users: firebase.firestore.FieldValue.arrayUnion(email),
            usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                email, hasRead: true, chatIsSelected: false
            })
        })
        .catch((err) => {
            console.log("[ChatAccept] ", err);
            setAcceptError(err);
        });
    await firestore
        .collection("chats")
        .doc(chat.id)
        .update({ invited: firebase.firestore.FieldValue.arrayRemove(email) })
        .catch((err) => {
            console.log("[ChatAccept] ", err);
            setAcceptError(err);
        });
    await firestore
        .collection("users")
        .doc(email)
        .get()
        .then(res => {
            firestore
            .collection("chats")
            .doc(chat.id)
            .update({
                // update the chat by adding a message object to the messages array in firestore
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: 'New Chat Member Alert',
                    senderUsername: '',
                    message: username,
                    timestamp: Date.now(),
                    type: 4,
                    fileName: ''
                }),
            })
            .then(() => {});
        });

    //   if (inviteEmail !== undefined) {
    //     await firestore
    //       .collection("chats")
    //       .doc(chats.find(e => e.name === selectedChat).id)
    //       .update({
    //         invited: firebase.firestore.FieldValue.arrayUnion(inviteEmail)
    //       })
    //       .catch(err => {
    //         console.log("[ChatInvite] Error ", err);
    //         return;
    //       });
    //     setInviteError("Invite sent!");
    //   }
    setAcceptError("");
};

const declineInvite = async (chat, email, setAcceptError) => {
    setAcceptError(null);
    await firestore
        .collection("chats")
        .doc(chat.id)
        .update({ invited: firebase.firestore.FieldValue.arrayRemove(email) })
        .catch((err) => {
            console.log("[ChatAccept] ", err);
            setAcceptError(err);
        });
    //   if (inviteEmail !== undefined) {
    //     await firestore
    //       .collection("chats")
    //       .doc(chats.find(e => e.name === selectedChat).id)
    //       .update({
    //         invited: firebase.firestore.FieldValue.arrayUnion(inviteEmail)
    //       })
    //       .catch(err => {
    //         console.log("[ChatInvite] Error ", err);
    //         return;
    //       });
    //     setInviteError("Invite sent!");
    //   }
};
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& p':{                 //color of helper text
        color:'#89A18F',
        marginLeft: 0
      },
      // '& label.Mui-focused': {
      //   color: '#184A46',
      // },
      "& .MuiInputBase-root": {
        color: "green",
      },
      "& .MuiFormLabel-root": {
        color: "black",
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#184A46', // default underline color
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: 'green', // color of underline when hovered
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green', // color of underline when focused
      },
    },
    margin: {
      margin: theme.spacing(1),
    },
    large: {
      width: theme.spacing(11),
      height: theme.spacing(11),
      alignSelf: "center",
      margin: "5%"
    },
  }));
  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });
  
export const ChatAcceptComponent = ({ showChatAccept, closeChatAccept, email, username }) => {
    const [acceptError, setAcceptError] = useState("");
    const [invitedChats, setInvitedChats] = useState([]);
    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {
        firestore
            .collection("chats")
            .where("invited", "array-contains", email)
            .onSnapshot((result) => {
                let chats = result.docs.map((doc) => doc.data());
                setInvitedChats(chats);
                // dispatch({
                //     type: "SET_CHAT_INVITE_COUNT",
                //     payload: chats.length,
                // });
            });
    }, [email]);

    const classes = useStyles();
    return (
        <Dialog
            TransitionComponent={Transition}
            TransitionProps={zoomProps}
            open={showChatAccept}
            onClose={closeChatAccept}
            aria-labelledby="form-dialog-title"
            style={{ textAlign: "center" }}
            fullWidth
            maxWidth={'xs'}
        >
        <Slide timeout={{enter: '1000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
            <Avatar 
                alt="Remy Sharp"
                src={require("../../assets/logo/logo.jpg")}
                className={classes.large}
                variant="circular"
            />
        </Slide>
        <Slide timeout={{enter: '1200ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
            <Button
                variant="outlined"
                disabled
                style={{
                    fontSize: 17,
                    color: "#184A46",
                    borderRadius: 5, 
                    borderColor: "green", 
                    width: "80%", 
                    alignSelf: "center",
                    marginBottom: "5%"
                }}    
            >
                Accept/decline invites
            </Button>
        </Slide>
            
            {/* <DialogTitle>Accept or decline chat invites</DialogTitle> */}
            {invitedChats.length === 0 ? (
                <Slide timeout={{enter: '1400ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                    <DialogContentText>You have no invites.</DialogContentText>
                </Slide>
                
            ) : null}
            <Slide timeout={{enter: '1600ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
            <List>
                {invitedChats.map((chat, index) => {
                    return (
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={state.home.loadedAvatars[chat.owner]}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={chat.name}
                                secondary={chat.owner}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                        acceptInvite(
                                            chat,
                                            email,
                                            setAcceptError,
                                            username
                                        )
                                    }
                                >
                                    <DoneIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                        declineInvite(
                                            chat,
                                            email,
                                            setAcceptError
                                        )
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            </Slide>
            {acceptError ? (
                <Typography
                    component="h5"
                    variant="h6"
                    style={{ textAlign: "center" }}
                >
                    {acceptError}
                </Typography>
            ) : null}
        </Dialog>
    );
};
