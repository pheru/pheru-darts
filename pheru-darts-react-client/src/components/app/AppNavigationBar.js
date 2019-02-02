import React from 'react'
import {Badge, Button, Glyphicon} from "react-bootstrap";
import {NAVIGATION_ITEM} from "../../constants/navigationItems";
import {Link} from "react-router-dom";
import FullscreenButton from "./FullscreenButton";
import PropTypes from "prop-types";
import NavbarLoginLoader from "../general/loaders/NavbarLoginLoader";
import NavigationBarItem from "../general/navigationbar/NavigationBarItem";
import NavigationBar, {DropdownConfig, NavigationBarContainer} from "../general/navigationbar/NavigationBar";

class AppNavigationBar extends React.Component {

    render() {
        let fixedItems = [
            <FullscreenButton key="fullscreen-button" className="navigation-bar-bordered-item"/>,
            <Link key="brand" className="navigation-bar-item navigation-bar-header" to={"/"}>
                Pheru-Darts
            </Link>
        ];

        let gameItems = this.createGameLinks();
        let gameDropdownConfig = new DropdownConfig("game_dropdown", <Glyphicon glyph="expand"/>, "Spielmenü");
        let leftContainer = new NavigationBarContainer(gameItems, gameItems, gameDropdownConfig);

        let userItemsUnmerged = this.createUserLinks(false);
        let userItemsMerged = this.createUserLinks(true);
        let userDropdownConfig = new DropdownConfig("user_dropdown", <Glyphicon glyph="user"/>,
            this.props.userName ? this.props.userName : "Benutzer");
        let rightContainer = new NavigationBarContainer(userItemsUnmerged, userItemsMerged, userDropdownConfig);

        let singleDropdownConfig = new DropdownConfig("hamburger_dropdown",
            <Glyphicon className="navigation-bar-bordered-item-icon" glyph="menu-hamburger"/>,
            null, false);
        return <NavigationBar
            style={{zIndex: 1030}}
            fixedItems={fixedItems}
            leftContainer={leftContainer}
            rightContainer={rightContainer}
            singleDropdown={singleDropdownConfig}
        />
    }

    createGameLinks() {
        return [
            <NavigationBarItem key="new-game-link" navigationItem={NAVIGATION_ITEM.NEW_GAME}/>,
            <NavigationBarItem key="new-training-link" navigationItem={NAVIGATION_ITEM.NEW_TRAINING}/>,
            this.props.gameRunning && <NavigationBarItem key="game-link" navigationItem={NAVIGATION_ITEM.GAME}/>
        ]
    }

    createUserLinks(showOptionalText) {
        return [
            <NavigationBarItem key="settings-link" navigationItem={NAVIGATION_ITEM.SETTINGS}
                               showText={showOptionalText}/>,

            this.props.isLoggedIn &&
            <NavigationBarItem key="notifications-link" navigationItem={NAVIGATION_ITEM.NOTIFICATIONS}
                               showText={showOptionalText}>
                {this.props.unreadNotificationsCount > 0 &&
                <Badge style={{marginLeft: 2, backgroundColor: "#337ab7"}}>
                    {this.props.unreadNotificationsCount}
                </Badge>
                }
            </NavigationBarItem>,

            this.props.isLoggedIn &&
            <NavigationBarItem key="statistics-link" navigationItem={NAVIGATION_ITEM.STATISTICS}
                               showText={showOptionalText}/>,

            !this.props.isLoggedIn &&
            <Button key="login-link"
                    className="navigation-bar-item"
                    onClick={this.props.showLogin}
                    disabled={this.props.isLoggingIn}>
                <div style={{position: "relative"}}>
                    {NAVIGATION_ITEM.LOGIN.icon} {this.props.isLoggingIn ? "Melde an..." : NAVIGATION_ITEM.LOGIN.text}
                    {this.props.isLoggingIn &&
                    <NavbarLoginLoader/>
                    }
                </div>
            </Button>,

            this.props.isLoggedIn &&
            <Button key="logout-link"
                    className="navigation-bar-item"
                    onClick={() => {
                        if (this.props.gameRunning) {
                            this.props.showConfirmation(
                                "Wirklich abmelden?",
                                "Das aktuelle Spiel wird dadurch abgebrochen.",
                                () => {
                                    this.props.exitGame();
                                    this.props.logout();
                                }
                            );
                        } else {
                            this.props.logout();
                        }
                    }}
                    disabled={this.props.isLoggingOut}>
                <div style={{position: "relative"}}>
                    {NAVIGATION_ITEM.LOGOUT.icon} {NAVIGATION_ITEM.LOGOUT.text} ({this.props.userName})
                </div>
            </Button>
        ]
    }
}

AppNavigationBar.propTypes = {
    userName: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggingOut: PropTypes.bool.isRequired,
    gameRunning: PropTypes.bool.isRequired,
    showLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    exitGame: PropTypes.func.isRequired,
    unreadNotificationsCount: PropTypes.number.isRequired
};

export default AppNavigationBar