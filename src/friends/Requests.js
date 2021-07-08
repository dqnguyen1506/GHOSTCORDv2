import React, { useEffect, useContext, useState } from "react";
import { auth, firestore } from "../config/fire";
import firebase from "firebase/app";
import Divider from "@material-ui/core/Divider";
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
    Slide
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

const Requests = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const deletePending = async (email, name) => {
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
        if(state.alert.message !== 'User removed from Pending!'){
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'Request removed from Pending!',
            });
        };
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                sent: firebase.firestore.FieldValue.arrayRemove({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                received: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .where("email", "==", state.user.email)
            .get()
            .then((res) => {
                setSent(res.docs[0].data().sent);
                setReceived(res.docs[0].data().received);
            });
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });
    };

    const deleteRequest = async (email, name) => {
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
        if(state.alert.message !== 'User removed from Pending!'){
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'Request deleted from Received!',
            });
        };
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                received: firebase.firestore.FieldValue.arrayRemove({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                sent: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .where("email", "==", state.user.email)
            .get()
            .then((res) => {
                setSent(res.docs[0].data().sent);
                setReceived(res.docs[0].data().received);
            });
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });
    };

    const acceptRequest = async (email, name) => {
        if(state.display.showAlert === true){
            await dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        };
        if(state.alert.type !== 'friend request accepted'){
            await dispatch({
                type: "SET_ALERT_TYPE",
                payload: 'friend request accepted',
            });
        };
        if(state.alert.message !== 'Friend request accepted!'){
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'Friend request accepted!',
            });
        };
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                received: firebase.firestore.FieldValue.arrayRemove({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                sent: firebase.firestore.FieldValue.arrayRemove({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .then(() => {});

        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                friends: firebase.firestore.FieldValue.arrayUnion({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                friends: firebase.firestore.FieldValue.arrayUnion({
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
        //     .onSnapshot((res) => {
        //         dispatch({
        //             type: "SET_FRIEND_REQUEST_COUNT",
        //             payload: res.docs[0].data().received.length,
        //         });
        //         if (res.docs[0].data().received.length > 0){
        //             dispatch({
        //                 type: "SET_SHOW_REQUEST_NOTIFICATION",
        //                 payload: '',
        //             });
        //         }else{
        //             dispatch({
        //                 type: "SET_SHOW_REQUEST_NOTIFICATION",
        //                 payload: 'none',
        //             });
        //         }
        //         setSent(res.docs[0].data().sent);
        //         setReceived(res.docs[0].data().received);
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

    useEffect(() => {
        var unsubscribe = firestore
            .collection("users")
            .where("email", "==", state.user.email)
            .onSnapshot((res) => {
                setSent(res.docs[0].data().sent);
                setReceived(res.docs[0].data().received);
            });
        return () => {
            unsubscribe();
        };
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

    return (
        <div>
            <Grid 
                container
                direction='column'
                justify='center'
                alignItems='center'
            >
            <em>Pending ({sent.length})</em>
            <List style = {{width:'50%'}}>
                {sent !== undefined
                    ? sent.map((users, index) => {
                          return (
                              <>
                                  <ListItem key={index}>
                                      <ListItemAvatar>
                                          <Avatar
                                              src={
                                                  state.home.loadedAvatars[
                                                      users.email
                                                  ]
                                              }
                                          ></Avatar>
                                      </ListItemAvatar>
                                      <ListItemText primary={users.name} secondary = {users.email} />
                                      <ListItemSecondaryAction>
                                          {/* <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => sendRequest(users.email)}
                                >
                                    <AddIcon />
                                </IconButton> */}
                                          <IconButton
                                              edge="end"
                                              aria-label="delete"
                                              onClick={() =>
                                                  deletePending(
                                                      users.email,
                                                      users.name
                                                  )
                                              }
                                          >
                                              <DeleteIcon />
                                          </IconButton>
                                      </ListItemSecondaryAction>
                                  </ListItem>
                                  <Divider />
                              </>
                          );
                      })
                    : null}
            </List>
            <em>Received ({received.length})</em>
            <List style = {{width:'50%'}}>
                {received !== undefined
                    ? received.map((users, index) => {
                          return (
                              <ListItem key={index}>
                                  <ListItemAvatar>
                                      <Avatar
                                          src={
                                              state.home.loadedAvatars[
                                                  users.email
                                              ]
                                          }
                                      ></Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary={users.name} secondary = {users.email}/>
                                  <ListItemSecondaryAction>
                                      <IconButton
                                          edge="end"
                                          aria-label="accept"
                                          onClick={() => 
                                              acceptRequest(
                                                  users.email,
                                                  users.name
                                              )
                                              
                                          }
                                      >
                                          <AddIcon />
                                      </IconButton>
                                      <IconButton
                                          edge="end"
                                          aria-label="delete"
                                          onClick={() =>
                                              deleteRequest(
                                                  users.email,
                                                  users.name
                                              )
                                          }
                                      >
                                          <DeleteIcon />
                                      </IconButton>
                                  </ListItemSecondaryAction>
                              </ListItem>
                          );
                      })
                    : null}
            </List>
            </Grid>
        </div>
    );
};

export default Requests;
