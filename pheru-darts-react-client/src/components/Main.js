import React from 'react'
import Tile from "./Tile";
import PropTypes from 'prop-types';
import {
    GAME_ROUTE,
    NEW_GAME_ROUTE,
    NEW_TRAINING_ROUTE,
    SETTINGS_ROUTE,
    STATISTICS_ROUTE
} from "../constants/routes";

const TILE_CONTAINER_STYLE = {
    display: 'grid',
    gridGap: 0,
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
};
const TILE_STYLE = {
    margin: 5
};

class Main extends React.Component {

    render() {
        return <div>
            <div style={TILE_CONTAINER_STYLE}>
                <Tile onClick={() => this.props.history.push(NEW_GAME_ROUTE)}
                      style={TILE_STYLE} glyph="edit" text="Neues Spiel"/>
                <Tile onClick={() => this.props.history.push(NEW_TRAINING_ROUTE)}
                      style={TILE_STYLE} glyph="upload" text="Training"/>
                {this.props.gameRunning &&
                <Tile onClick={() => this.props.history.push(GAME_ROUTE)}
                      style={TILE_STYLE} glyph="play-circle" text="Aktuelles Spiel"/>
                }
            </div>
            <div style={TILE_CONTAINER_STYLE}>
                <Tile onClick={() => this.props.history.push(STATISTICS_ROUTE)}
                      style={TILE_STYLE} glyph="stats" text="Statistiken"/>
                <Tile onClick={() => this.props.history.push(SETTINGS_ROUTE)}
                      style={TILE_STYLE} glyph="cog" text="Einstellungen"/>
            </div>
            <div style={TILE_CONTAINER_STYLE}>
                {this.props.isLoggedIn
                    ? <Tile onClick={this.props.logout} disabled={this.props.isLoggingOut}
                            style={TILE_STYLE} glyph="log-out" text="Abmelden"/>
                    : <Tile onClick={this.props.showLogin} disabled={this.props.isLoggingIn}
                            style={TILE_STYLE} glyph="log-in" text="Anmelden"/>
                }
            </div>
        </div>
    }
}

Main.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggingOut: PropTypes.bool.isRequired,
    gameRunning: PropTypes.bool.isRequired,
    showLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default Main