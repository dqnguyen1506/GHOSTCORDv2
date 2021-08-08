import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import LoginPageComponent from "./components/login/LoginPage";
import HomeComponent from "./components/groupchat/Home";
import {ProfileComponent} from "./components/profile/profile";
import EditProfileComponent from "./components/profile/editProfile";
import FriendsComponent from "./components/friends/friends";
import AboutComponent from "./components/about/about";
import WhiteBoardComponent from "./components/whiteboard/whiteboard";
import VideoChatComponent from "./components/video/videochat";
import { GlobalProvider } from "./global-context/State";
import { GlobalContext } from "./global-context/State";
import { auth } from "./api-config/fire";

const RoutingComponent = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    // Set global state user if logged in
    useEffect(() => {
        function unsubscribe () {
            auth.onAuthStateChanged(async(res) => {
                try{
                     //if logged in
                    if (res) {
                        await dispatch({
                            type: "SET_USER",
                            payload: res,
                        });

                        if(state.alert.type !== 'logged in'){
                            await dispatch({
                                type: "SET_ALERT_TYPE",
                                payload: 'logged in',
                            });
                        };
                        if(state.alert.message !== 'Successfully logged in.'){
                            await dispatch({
                                type: "SET_ALERT_MESSAGE",
                                payload: 'Successfully logged in.',
                            });
                        };
                        await delay(1000);
                        await dispatch({
                            type: "SET_SHOW_ALERT",
                            payload: true,
                        });
                    } else {
                        dispatch({ type: "NO_USER" });
                    }
                } catch(e){
                    console.error(e);
                }
            });
        }
        unsubscribe();
    }, [state.user.email]);

    return (
        <Router>
            <div id="routing-container">
                {/*redirect to dashboard if logged in, otherwise redirect to login*/}
                <Redirect exact from="/" to={state.user.auth? "/dashboard" : "/login"} />
                <Route exact path="/" component={LoginPageComponent}></Route>
                <Route path="/login" component={LoginPageComponent}></Route>
                <Route path="/signup" component={LoginPageComponent}></Route>
                <Route
                    path="/dashboard"
                    render={({ history }) => (
                        <HomeComponent history={history} />
                    )}
                ></Route>
                <Route
                    path="/friends"
                    render={({ history }) => (
                        <FriendsComponent history={history} />
                    )}
                ></Route>
                <Route
                    exact
                    path="/profile"
                    render={({ history }) => (
                        // <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                        //     <ProfileComponent history={history} />
                        // </Slide>
                        <ProfileComponent history={history} />
                    )}
                ></Route>
                <Route
                    path="/profile/edit"
                    render={({ history }) => (
                        // <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        //     <EditProfileComponent history={history} />
                        // </Slide>
                        <EditProfileComponent history={history} />
                    )}
                ></Route>
                <Route
                    path="/whiteboard"
                    render={({ history }) => (
                        <WhiteBoardComponent history={history} />
                    )}
                ></Route>
                <Route
                    path="/about"
                    render={({ history }) => (
                        <AboutComponent history={history} />
                    )}
                ></Route>
                <Route
                    path="/video"
                    render={({ history }) => (
                        <VideoChatComponent history={history} />
                    )}
                ></Route>
            </div>
        </Router>
    );
};

ReactDOM.render(
    <GlobalProvider>
        <RoutingComponent />
    </GlobalProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
