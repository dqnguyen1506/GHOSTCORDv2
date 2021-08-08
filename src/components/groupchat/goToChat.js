import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import { GlobalContext } from "../../global-context/State.js";
import React, { useState, useEffect, useContext } from "react";
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export const GoToChatComponent = ({selectFunction, name, email, showGoToChat, closeGoToChat}) => {
    const [open, setOpen] = useState(null);
    const { state, dispatch } = useContext(GlobalContext);
    const handleCommand = async () => {
        let directChats = state.home.chats.filter((chat) => chat.type ==='1on1');
        let res = state.home.chats.filter((chat) => 
            chat.users.includes(email) && 
            chat.users.includes(state.user.email) && 
            chat.type === '1on1');
        let index = state.home.chats.indexOf(res[0]);
        await selectFunction(index);
        await dispatch({ 
            type: "SET_SELECTED_DIRECTCHATS_INDEX", 
            payload: directChats.indexOf(res[0])  
        });
        await dispatch({ 
            type: "SET_SELECTED_GROUPCHATS_INDEX", 
            payload: null 
        });
    }
    return (
        <Dialog
            keepMounted 
            open={showGoToChat}
            onClose={closeGoToChat}
            aria-labelledby="choose-chat-dialog-title"
            TransitionComponent={Transition}
            >
                <DialogTitle style={{textAlign: "center"}}>{"START CHATTING?"}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Chat with {<strong>
                        {`${name} (${email})`}
                    </strong>} created!
                </DialogContentText>
                </DialogContent>
                
                <DialogActions style={{justifyContent: "center"}}>
                    <Button 
                        style={{color: "#184A46"}}
                        onClick={async () =>{
                            await handleCommand();
                            dispatch({
                                type: "SET_SHOW_GO_TO_CHAT",
                                payload: false,
                            });
                        }}
                >
                        CONFIRM
                    </Button>
                    <Button 
                        style={{color: "#89A18F"}}
                        color={"secondary"}
                        onClick={closeGoToChat}
                >
                        CANCEL
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

