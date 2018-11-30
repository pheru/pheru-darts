import React from 'react'
import {Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Badge, Glyphicon, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import NewGameConfigContainer from "../../containers/NewGameConfigContainer";
import GameContainer from "../../containers/GameContainer";
import {
    ABOUT_ROUTE,
    GAME_ROUTE,
    NEW_GAME_ROUTE,
    NEW_TRAINING_ROUTE,
    NOTIFICATIONS_ROUTE,
    SETTINGS_ROUTE,
    STATISTICS_ROUTE
} from "../../constants/routes";
import StatisticsContainer from "../../containers/StatisticsContainer";
import SettingsContainer from "../../containers/SettingsContainer";
import LoginModalContainer from "../../containers/modals/LoginModalContainer";
import SignUpModalContainer from "../../containers/modals/SignUpModalContainer";
import PropTypes from 'prop-types';
import NavbarLoginLoader from "../general/loaders/NavbarLoginLoader";
import AboutContainer from "../../containers/AboutContainer";
import SimpleModalContainer from "../../containers/modals/SimpleModalContainer";
import FullscreenButton from "./FullscreenButton";
import MainContainer from "../../containers/MainContainer";
import NotificationsContainer from "../../containers/NotificationsContainer";
import MediaQuery from "react-responsive";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            showSignUp: false
        };

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.showLoginModal = this.showLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignUpModal = this.showSignUpModal.bind(this);
        this.hideSignUpModal = this.hideSignUpModal.bind(this);
    }

    componentDidMount() {
        window.onbeforeunload = this.onBeforeUnload;
        this.props.loginByToken(false);
    }

    onBeforeUnload(e) {
        if (this.props.gameRunning) {
            let dialogText = 'Seite wirklich verlassen?';
            e.returnValue = dialogText;
            return dialogText;
        } else {
            return undefined;
        }
    }

    showLoginModal() {
        this.setState({showLogin: true});
    }

    hideLoginModal() {
        this.setState({showLogin: false});
    }

    showSignUpModal() {
        this.setState({showSignUp: true});
    }

    hideSignUpModal() {
        this.setState({showSignUp: false});
    }

    render() {
        return <div style={{height: "100%"}}>
            <FullscreenButton/>
            {this.createNavbar()}
            <div style={{height: "100%", paddingTop: 50}}>
                <Switch>
                    <Route path={NEW_GAME_ROUTE} render={(props) =>
                        <NewGameConfigContainer {...props} key="newgameconfig"/>}
                    />
                    <Route path={NEW_TRAINING_ROUTE} render={(props) =>
                        <NewGameConfigContainer {...props} key="newgameconfig_training" training/>}
                    />
                    {this.props.gameRunning &&
                    <Route path={GAME_ROUTE} component={GameContainer}/>
                    }
                    <Route path={NOTIFICATIONS_ROUTE} component={NotificationsContainer}/>
                    <Route path={STATISTICS_ROUTE} component={StatisticsContainer}/>
                    <Route path={SETTINGS_ROUTE} component={SettingsContainer}/>
                    <Route path={ABOUT_ROUTE} component={AboutContainer}/>
                    {/*no-match-route*/}
                    <Route component={MainContainer}/>
                </Switch>
            </div>
            <LoginModalContainer/>
            <SignUpModalContainer/>
            <SimpleModalContainer/>
        </div>
    }

    createNavbar() {
        return <Navbar inverse collapseOnSelect fixedTop>
            <Navbar.Header>
                <LinkContainer to={"/"} style={{paddingLeft: 45}}>
                    <Navbar.Brand>Pheru-Darts</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
                <MediaQuery maxDeviceWidth={780}>
                    {(matches) => {
                        return this.createGameNav(matches)
                    }}
                </MediaQuery>

                <Nav pullRight>
                    {!this.props.isLoggedIn &&
                    <NavItem onClick={this.props.showLogin} disabled={this.props.isLoggingIn}>
                        <div style={{position: "relative"}}>
                            <Glyphicon glyph="log-in"/> Anmelden
                            {this.props.isLoggingIn &&
                            <NavbarLoginLoader/>
                            }
                        </div>
                    </NavItem>
                    }
                    {this.props.isLoggedIn &&
                    <NavDropdown title={this.createDropdownTitle("user", this.props.userName)} id="user-nav-dropdown">
                        <LinkContainer to={NOTIFICATIONS_ROUTE}>
                            <NavItem>
                                <Glyphicon glyph="bell"/> Mitteilungen
                                {this.props.unreadNotificationsCount > 0 &&
                                <Badge pullRight style={{backgroundColor: "#337ab7"}}>
                                    {this.props.unreadNotificationsCount}
                                </Badge>
                                }
                            </NavItem>
                        </LinkContainer>
                        <LinkContainer to={STATISTICS_ROUTE}>
                            <NavItem>
                                <Glyphicon glyph="stats"/> Statistiken
                            </NavItem>
                        </LinkContainer>
                        <LinkContainer to={SETTINGS_ROUTE}>
                            <NavItem>
                                <Glyphicon glyph="cog"/> Einstellungen
                            </NavItem>
                        </LinkContainer>
                        <NavItem onClick={() => {
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
                        }} disabled={this.props.isLoggingOut}>
                            <Glyphicon glyph="log-out"/> Abmelden
                        </NavItem>
                    </NavDropdown>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }

    createGameNav(asDropdown) {
        let navContent = [];
        navContent.push(
            <LinkContainer key="new_game_linkcontainer" to={NEW_GAME_ROUTE}>
                <NavItem><Glyphicon glyph="edit"/> Neues Spiel</NavItem>
            </LinkContainer>);
        navContent.push(
            <LinkContainer key="new_training_linkcontainer" to={NEW_TRAINING_ROUTE}>
                <NavItem><Glyphicon glyph="upload"/> Training</NavItem>
            </LinkContainer>);
        if (this.props.gameRunning) {
            navContent.push(
                <LinkContainer key="game_linkcontainer" to={GAME_ROUTE}>
                    <NavItem><Glyphicon glyph="play-circle"/> Aktuelles Spiel</NavItem>
                </LinkContainer>);
        }
        if (asDropdown) {
            return <Nav>
                <NavDropdown title={<div style={{display: "initial"}}><Glyphicon glyph="expand"/> Spiel</div>}
                             id="game-nav-dropdown">
                    {navContent}
                </NavDropdown>
            </Nav>
        } else {
            return <Nav>{navContent}</Nav>
        }
    }

    createDropdownTitle(glyph, text) {
        return <div style={{display: "initial"}}>
            {this.props.unreadNotificationsCount > 0 &&
            <Badge style={{backgroundColor: "#337ab7"}}>
                <Glyphicon glyph="bell"/>
            </Badge>
            }
            {" "}
            <Glyphicon glyph={glyph}/> {text}
        </div>
    };
}

App.propTypes = {
    userId: PropTypes.string,
    userName: PropTypes.string,

    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggingOut: PropTypes.bool.isRequired,

    gameRunning: PropTypes.bool.isRequired,

    fetchPlayableUsers: PropTypes.func.isRequired,
    fetchPlayableUsersFailed: PropTypes.bool.isRequired,

    fetchPermittedUsers: PropTypes.func.isRequired,
    fetchPermittedUsersFailed: PropTypes.bool.isRequired,

    showLogin: PropTypes.func.isRequired,
    loginByToken: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,

    showConfirmation: PropTypes.func.isRequired,
    exitGame: PropTypes.func.isRequired,

    unreadNotificationsCount: PropTypes.number.isRequired
};

export default App;