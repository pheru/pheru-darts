import React from 'react'
import {Badge, Button, Dropdown, Glyphicon, MenuItem} from "react-bootstrap";
import {NAVIGATION_ITEM} from "../../constants/navigationItems";
import {Link} from "react-router-dom";
import FullscreenButton from "./FullscreenButton";
import PropTypes from "prop-types";
import NavbarLoginLoader from "../general/loaders/NavbarLoginLoader";
import NavigationBarItem from "./NavigationBarItem";

const GAME_DROPDOWN = (items) =>
    <Dropdown id="game_dropdown">
        <Dropdown.Toggle className="navigation-bar-dropdown-toggle">
            <Glyphicon glyph="expand"/> Spielmenü
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {items.map((item, i) =>
                <CustomDropDownMenuItem key={"game_dropdown_item_" + i}>
                    {item}
                </CustomDropDownMenuItem>
            )}
        </Dropdown.Menu>
    </Dropdown>;

const USER_DROPDOWN = (items, userName) =>
    <Dropdown id="user_dropdown">
        <Dropdown.Toggle className="navigation-bar-dropdown-toggle">
            <Glyphicon glyph="user"/> {userName ? userName : "Benutzer"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="navigation-bar-dropdown-menu-right">
            {items.map((item, i) =>
                <CustomDropDownMenuItem key={"user_dropdown_item_" + i}>
                    {item}
                </CustomDropDownMenuItem>
            )}
        </Dropdown.Menu>
    </Dropdown>;

const SINGLE_DROPDOWN = (items) =>
    <Dropdown id="single_dropdown">
        <Dropdown.Toggle className="navigation-bar-bordered-item" noCaret>
            <Glyphicon className="navigation-bar-bordered-item-icon" glyph="menu-hamburger"/>
        </Dropdown.Toggle>
        <Dropdown.Menu className="navigation-bar-dropdown-menu-right">
            {items.map((item, i) =>
                <CustomDropDownMenuItem key={"single_dropdown_item_" + i}>
                    {item}
                </CustomDropDownMenuItem>
            )}
        </Dropdown.Menu>
    </Dropdown>;

const GAME_LINKS = (props) => [
    <NavigationBarItem key="new-game-link" navigationItem={NAVIGATION_ITEM.NEW_GAME}/>,
    <NavigationBarItem key="new-training-link" navigationItem={NAVIGATION_ITEM.NEW_TRAINING}/>,
    props.gameRunning && <NavigationBarItem key="game-link" navigationItem={NAVIGATION_ITEM.GAME}/>
];

const USER_LINKS = (props, showOptionalText) => [
    <NavigationBarItem key="settings-link" navigationItem={NAVIGATION_ITEM.SETTINGS}
                       showText={showOptionalText}/>,

    props.isLoggedIn &&
    <NavigationBarItem key="notifications-link" navigationItem={NAVIGATION_ITEM.NOTIFICATIONS}
                       showText={showOptionalText}>
        {props.unreadNotificationsCount > 0 &&
        <Badge style={{marginLeft: 2, backgroundColor: "#337ab7"}}>
            {props.unreadNotificationsCount}
        </Badge>
        }
    </NavigationBarItem>,

    props.isLoggedIn && <NavigationBarItem key="statistics-link" navigationItem={NAVIGATION_ITEM.STATISTICS}
                                           showText={showOptionalText}/>,

    !props.isLoggedIn &&
    <Button key="login-link"
            className="navigation-bar-item"
            onClick={props.showLogin}
            disabled={props.isLoggingIn}>
        <div style={{position: "relative"}}>
            <Glyphicon glyph="log-in"/> Anmelden
            {props.isLoggingIn &&
            <NavbarLoginLoader/>
            }
        </div>
    </Button>,

    props.isLoggedIn &&
    <Button key="logout-link"
            className="navigation-bar-item"
            onClick={() => {
                if (props.gameRunning) {
                    props.showConfirmation(
                        "Wirklich abmelden?",
                        "Das aktuelle Spiel wird dadurch abgebrochen.",
                        () => {
                            props.exitGame();
                            props.logout();
                        }
                    );
                } else {
                    props.logout();
                }
            }}
            disabled={props.isLoggingOut}>
        <div style={{position: "relative"}}>
            <Glyphicon glyph="log-out"/> Abmelden ({props.userName})
        </div>
    </Button>
];

// TODO focus(?)-selector auf menuitems -> weißer background
class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mergeCount: 0
        };
        this.bar = React.createRef();
        this.update = this.update.bind(this);
        this.shouldMerge = this.shouldMerge.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.update);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // + 1 für merge in SINGLE_DROPDOWN
        //TODO eine stelle
        let maxMergeCount = GAME_LINKS(this.props).length + USER_LINKS(this.props).length + 1;
        if (this.shouldMerge() && this.state.mergeCount < maxMergeCount) {
            let prevCount = this.state.mergeCount;
            this.setState({mergeCount: prevCount + 1});
        } else if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            this.update();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.update);
    }

    shouldMerge() {
        if (!this.bar || !this.bar.current) {
            return false;
        }
        return this.bar.current.offsetWidth < this.bar.current.scrollWidth;
    }

    update() {
        this.setState({mergeCount: 0});
    }

    render() {
        let userLinks = USER_LINKS(this.props, true);
        let userLinksWithoutText = USER_LINKS(this.props, false);
        let mergedUserLinks = [];
        let unmergedUserLinks = [];

        let gameLinks = GAME_LINKS(this.props);
        let mergedGameLinks = [];
        let unmergedGameLinks = [];

        let allLinks = [];

        // + 1 für merge in SINGLE_DROPDOWN
        //TODO eine stelle
        let maxMergeCount = GAME_LINKS(this.props).length + USER_LINKS(this.props).length + 1;
        if (this.state.mergeCount < maxMergeCount) {
            let mergeUserLengthDiff = userLinks.length - this.state.mergeCount;
            let userSliceIndex = mergeUserLengthDiff >= 0 ? mergeUserLengthDiff : 0;
            mergedUserLinks = userLinks.slice(userSliceIndex, userLinks.length);
            unmergedUserLinks = userLinksWithoutText.slice(0, userSliceIndex);

            let mergeGameLengthDiff = this.state.mergeCount - userLinks.length;
            let gameSliceIndex = mergeGameLengthDiff >= 0 ? mergeGameLengthDiff : 0;
            mergedGameLinks = gameLinks.slice(0, gameSliceIndex);
            unmergedGameLinks = gameLinks.slice(gameSliceIndex, gameLinks.length);
        } else {
            allLinks = gameLinks.concat(<MenuItem divider/>).concat(userLinks);
        }

        return <div ref={this.bar} className="navigation-bar">
            <div className="navigation-bar-container">
                <FullscreenButton className="navigation-bar-bordered-item"/>
                <Link className="navigation-bar-item navigation-bar-header" to={"/"}>
                    Pheru-Darts
                </Link>
                {mergedGameLinks.length > 0 && GAME_DROPDOWN(mergedGameLinks)}
                {unmergedGameLinks}
            </div>

            <div className="navigation-bar-container navigation-bar-container-right">
                {unmergedUserLinks}
                {mergedUserLinks.length > 0 && USER_DROPDOWN(mergedUserLinks, this.props.userName)}
                {allLinks.length > 0 && SINGLE_DROPDOWN(allLinks)}
            </div>
        </div>
    }
}

NavigationBar.propTypes = {
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

export default NavigationBar

/**
 * Wird benötigt, da das bootstrap-MenuItem ein a-tag rendered,
 * welches dadurch keine weiteren a-tags als children haben kann.
 */
class CustomDropDownMenuItem extends React.Component {
    render() {
        return <div role="menuitem" onClick={this.props.onSelect}>
            {this.props.children}
        </div>
    }
}