import React, { Component } from "react";
import "./about.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core";
import styles from "./styles";
import NavBarComponent from "../../routes/navBar/navBar";
import {
    Slide,
} from "@material-ui/core";

class AboutComponent extends Component {
    // A small section describing the application
    render() {
        const { classes } = this.props;
        return (
            <div style={{overflow:'hidden'}} className="">
                <NavBarComponent history={this.props.history} />
                {/* text animation sliding in from left */}
                <Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
                    <div className="our_story">
                        <h2>Our Story</h2>
                        <p>
                            Here at Ghostcord we strive to create a community
                            through a platform where people can connect on another
                            level, from anywhere in the world. We enable user to
                            technologically interact with each other’s worlds
                            through modern technology while delivering a satisfying
                            experience. Ghostcord will move technological
                            communication to a whole other dimension. With just a
                            few months since deployment, Ghostcord has become one of
                            the industry leading companies placing us with Snapchat,
                            Instagram, and Discord.
                        </p>
                    </div>
                </Slide>
                {/* text animation sliding in from right */}
                <Slide timeout={{enter: '500ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                    <div className="founders">
                        <h2>The Founders</h2>
                        <div className="names">
                            <div className="col">
                                <h4>Steven Chung</h4>
                                <h4>Henry Hong</h4>
                            </div>
                            <div className="col">
                                <h4>Dung Nguyen</h4>
                                <h4>Mattew Szeto</h4>
                            </div>
                        </div>
                    </div>
                </Slide>
                {/* text animation sliding in from left */}
                <Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
                    <div className="contact">
                        <h2>Contact Us</h2>
                        <div className="info">
                            <div className="col">
                                <p>
                                    <span>Email:</span>
                                    <a href=""> ghostcord@gmail.com</a>
                                </p>
                                <p>
                                    <span>Phone:</span> 453-528-2188
                                </p>
                            </div>
                        </div>
                    </div>
                </Slide>
            </div>
        );
    }
}

export default withStyles(styles)(AboutComponent);
