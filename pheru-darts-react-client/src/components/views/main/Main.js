import React from 'react'
import Tile from "./Tile";
import PropTypes from 'prop-types';
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import {Badge} from "react-bootstrap";
import NavigationTile from "./NavigationTile";
import TileRow from "./TileRow";

class Main extends React.Component {

    render() {
        return <div style={{height: "100%"}}>
            <TileRow>
                <NavigationTile navigationItem={NAVIGATION_ITEM.NEW_GAME} history={this.props.history}/>
                <NavigationTile navigationItem={NAVIGATION_ITEM.NEW_TRAINING} history={this.props.history}/>
                {this.props.gameRunning &&
                <NavigationTile navigationItem={NAVIGATION_ITEM.GAME} history={this.props.history}/>
                }
            </TileRow>
            <TileRow>
                <NavigationTile navigationItem={NAVIGATION_ITEM.SETTINGS} history={this.props.history}/>
                {this.props.isLoggedIn &&
                <NavigationTile navigationItem={NAVIGATION_ITEM.NOTIFICATIONS} history={this.props.history}
                                style={{position: "relative"}}>
                    {this.props.unreadNotificationsCount > 0 &&
                    <Badge style={{
                        backgroundColor: "#222",
                        color: "white",
                        position: "absolute",
                        top: 5,
                        left: "54%"
                    }}>
                        {this.props.unreadNotificationsCount}
                    </Badge>
                    }
                </NavigationTile>
                }
                {this.props.isLoggedIn &&
                <NavigationTile navigationItem={NAVIGATION_ITEM.STATISTICS} history={this.props.history}/>
                }
            </TileRow>
            <TileRow>
                {this.props.isLoggedIn
                    ? <Tile onClick={this.props.logout} disabled={this.props.isLoggingOut}
                            glyph={NAVIGATION_ITEM.LOGOUT.icon} text={NAVIGATION_ITEM.LOGOUT.text}/>
                    : <Tile onClick={this.props.showLogin} disabled={this.props.isLoggingIn}
                            glyph={NAVIGATION_ITEM.LOGIN.icon} text={NAVIGATION_ITEM.LOGIN.text}/>
                }
            </TileRow>
        </div>
    }
}

Main.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggingOut: PropTypes.bool.isRequired,
    gameRunning: PropTypes.bool.isRequired,
    unreadNotificationsCount: PropTypes.number.isRequired,
    showLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default Main