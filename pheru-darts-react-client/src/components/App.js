import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Glyphicon, Nav, Navbar, NavItem} from "react-bootstrap";
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import GameContainer from "../containers/GameContainer";
import {ABOUT_ROUTE, GAME_ROUTE, NEW_GAME_ROUTE, SETTINGS_ROUTE, STATISTICS_ROUTE} from "../constants/routes";
import StatisticsContainer from "../containers/StatisticsContainer";
import SettingsContainer from "../containers/SettingsContainer";
import LoginModalContainer from "../containers/modals/LoginModalContainer";
import SignUpModalContainer from "../containers/modals/SignUpModalContainer";
import PropTypes from 'prop-types';
import NavbarLoginLoader from "./loaders/NavbarLoginLoader";
import AboutContainer from "../containers/AboutContainer";
import SimpleModalContainer from "../containers/modals/SimpleModalContainer";
import FullscreenButton from "./FullscreenButton";

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
        return <div>
            <FullscreenButton/>
            {this.createNavbar()}
            <div style={{paddingTop: 50}}>
                <Switch>
                    <Route path={NEW_GAME_ROUTE} component={NewGameConfigContainer}/>
                    <Route path={GAME_ROUTE}
                           render={() => this.props.gameRunning
                               ? <div style={{paddingTop: 10}}><GameContainer/></div>
                               : <Redirect to={NEW_GAME_ROUTE}/>
                           }
                    />
                    <Route path={STATISTICS_ROUTE} component={StatisticsContainer}/>
                    <Route path={SETTINGS_ROUTE} component={SettingsContainer}/>
                    <Route path={ABOUT_ROUTE} component={AboutContainer}/>
                    {/*no-match-route*/}
                    <Route render={() => <Redirect to={NEW_GAME_ROUTE}/>}/>
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
                <Navbar.Brand style={{
                    color: '#8b8d8f', cursor: 'default',
                    fontVariant: 'small-caps',
                    fontStyle: 'italic',
                    textDecoration: 'underline',
                    paddingLeft: 45
                }}>
                    Pheru-Darts
                </Navbar.Brand>
                <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to={NEW_GAME_ROUTE}>
                        <NavItem><Glyphicon glyph="edit"/> Neues Spiel</NavItem>
                    </LinkContainer>
                    {this.props.gameRunning &&
                    <LinkContainer to={GAME_ROUTE}>
                        <NavItem><Glyphicon glyph="play-circle"/> Aktuelles Spiel</NavItem>
                    </LinkContainer>
                    }
                </Nav>
                <Nav pullRight>
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
                    <NavItem onClick={this.props.logout} disabled={this.props.isLoggingOut}>
                        <Glyphicon glyph="log-out"/> Abmelden ({this.props.userName})
                    </NavItem>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
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
};

export default App;
