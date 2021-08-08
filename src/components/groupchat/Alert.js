import { GlobalContext } from "../../global-context/State";
import React, { useContext} from "react";
import {
    IconButton,
    Slide
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from "@material-ui/icons/Delete";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const AlertComponent = ({type, message}) => {
    const { state, dispatch } = useContext(GlobalContext);
    return(
        <div 
            style={{
                position: 'fixed',
                top: '90vh',
                left: '50vw',
                transform: 'translate(-50%, -50%)',
                zIndex: 1
            }}
        >
            {state.alert.type === 'friend request sent' &&
                <Slide direction="left" in={state.display.showAlert} mountOnEnter unmountOnExit>
                    <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        action={
                            <IconButton 
                                onClick={()=> dispatch({
                                type: "SET_SHOW_ALERT",
                                payload: false,
                                })}
                                color="inherit" size="small"
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                            } 
                        severity="success"
                    >
                        <AlertTitle>Success</AlertTitle>
                        {state.alert.message}
                    </Alert>
                </Slide>
            }
            {state.alert.type === 'deleted' &&
                <Slide direction="left" in={state.display.showAlert} mountOnEnter unmountOnExit>
                    <Alert
                        icon={<DeleteIcon fontSize="inherit" />}
                        action={
                            <IconButton 
                                onClick={()=> dispatch({
                                type: "SET_SHOW_ALERT",
                                payload: false,
                                })}
                                color="inherit" size="small"
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                            } 
                        severity="error"
                    >
                        <AlertTitle>Deleted</AlertTitle>
                        {state.alert.message}
                    </Alert>
                </Slide>
            }
            {state.alert.type === 'friend request accepted' &&
                <Slide direction="left" in={state.display.showAlert} mountOnEnter unmountOnExit>
                    <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        action={
                            <IconButton 
                                onClick={()=> dispatch({
                                type: "SET_SHOW_ALERT",
                                payload: false,
                                })}
                                color="inherit" size="small"
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                            } 
                        severity="success"
                    >
                        <AlertTitle>Success</AlertTitle>
                        {state.alert.message}
                    </Alert>
                </Slide>
            }
            {state.alert.type === 'logged in' &&
                <Slide timeout={{appear:500, enter: 500, exit:250}} direction="left" in={state.display.showAlert} mountOnEnter unmountOnExit>
                    <Alert
                        icon={<ExitToAppIcon fontSize="inherit" />}
                        action={
                            <IconButton 
                                onClick={()=> dispatch({
                                type: "SET_SHOW_ALERT",
                                payload: false,
                                })}
                                color="inherit" size="small"
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                            } 
                        severity="success"
                    >
                        <AlertTitle>Success</AlertTitle>
                        {state.alert.message} - Welcome to <strong>Ghostcord</strong>
                    </Alert>
                </Slide>
            }
            {state.alert.type === 'logged out' &&
                <Slide timeout={{appear:500, enter: 500, exit:250}} direction="left" in={state.display.showAlert} mountOnEnter unmountOnExit>
                    <Alert
                        icon={<ArrowBackIcon fontSize="inherit" />}
                        action={
                            <IconButton 
                                onClick={()=> dispatch({
                                type: "SET_SHOW_ALERT",
                                payload: false,
                                })}
                                color="inherit" size="small"
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                            } 
                        severity="success"
                    >
                        <AlertTitle>Success</AlertTitle>
                        {state.alert.message} - <strong>Comeback soon and goodbye!</strong>
                    </Alert>
                </Slide>
            }
        </div>
    );
};

export default AlertComponent;