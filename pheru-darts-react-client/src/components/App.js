import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Alert, Button, Glyphicon, Nav, Navbar, NavItem} from "react-bootstrap";
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import GameContainer from "../containers/GameContainer";
import {GAME_ROUTE, NEW_GAME_ROUTE, SETTINGS_ROUTE, STATISTICS_ROUTE} from "../constants/routes";
import StatisticsContainer from "../containers/StatisticsContainer";
import SettingsContainer from "../containers/SettingsContainer";
import LoginModalContainer from "../containers/modals/LoginModalContainer";
import SignUpModalContainer from "../containers/modals/SignUpModalContainer";
import {ScaleLoader} from "react-spinners";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertDismissed: false,
            showLogin: false,
            showSignUp: false
        };

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.showLoginModal = this.showLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignUpModal = this.showSignUpModal.bind(this);
        this.hideSignUpModal = this.hideSignUpModal.bind(this);
    }

    componentDidMount() {
        window.onbeforeunload = this.onBeforeUnload;
        this.props.loginByToken();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
            this.props.fetchAllUsers();
            this.props.fetchPlayableUsers(this.props.userId);
            this.props.fetchPermittedUsers(this.props.userId);
        }
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

    handleAlertDismiss() {
        this.setState({alertDismissed: true});
    }

    render() {
        return <div>
            {this.createNavbar()}
            <div style={{paddingTop: 60}}>
                {this.props.fetchAllUsersFailed && !this.state.alertDismissed &&
                <Alert style={{marginTop: -10, borderRadius: 0}} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                    <h4>Spieler konnten nicht abgerufen werden!</h4>
                    <p>Spiel nur mit unregistrierten Benutzern möglich (keine Erfassung von Statistiken)</p>
                </Alert>
                }
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
                    {/*no-match-route*/}
                    <Route render={() => <Redirect to={NEW_GAME_ROUTE}/>}/>
                </Switch>
            </div>
            <LoginModalContainer/>
            <SignUpModalContainer/>
        </div>
    }

    createNavbar() {
        return <Navbar inverse collapseOnSelect fixedTop>
            <Navbar.Header>
                <Navbar.Brand style={{
                    color: '#8b8d8f', cursor: 'default',
                    fontVariant: 'small-caps',
                    fontStyle: 'italic',
                    textDecoration: 'underline'
                }}>
                    Pheru-Darts
                </Navbar.Brand>
                <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to={NEW_GAME_ROUTE}>
                        <NavItem><Glyphicon glyph="play-circle"/> Neues Spiel</NavItem>
                    </LinkContainer>
                    <LinkContainer to={STATISTICS_ROUTE}>
                        <NavItem>
                            <Glyphicon glyph="stats"/> Statistiken
                        </NavItem>
                    </LinkContainer>
                    {this.props.gameRunning && this.props.location.pathname !== GAME_ROUTE &&
                    <LinkContainer to={GAME_ROUTE}>
                        <NavItem><Glyphicon glyph="share-alt"/> Zurück zum Spiel</NavItem>
                    </LinkContainer>
                    }
                </Nav>
                {(this.props.isLoggingIn || this.props.isLoggingOut) &&
                <Nav style={{paddingTop: 5}} pullRight>
                        <ScaleLoader color={'#8b8d8f'}/>
                </Nav>
                }
                {!this.props.isLoggedIn && !this.props.isLoggingIn && !this.props.isLoggingOut &&
                <Navbar.Form pullRight>
                    <Button bsStyle="link" style={{outline: 0}} onClick={this.props.showLogin}>
                        <Glyphicon glyph="log-in"/> Anmelden
                    </Button>
                </Navbar.Form>
                }
                {this.props.isLoggedIn && !this.props.isLoggingIn && !this.props.isLoggingOut &&
                <Navbar.Form pullRight>
                    <Button bsStyle="link" style={{outline: 0}} onClick={this.props.logout}>
                        <Glyphicon glyph="log-out"/> Abmelden ({this.props.userName})
                    </Button>
                </Navbar.Form>
                }
                <Nav pullRight>
                    <LinkContainer to={SETTINGS_ROUTE}>
                        <NavItem>
                            <Glyphicon glyph="cog"/> Einstellungen
                        </NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
}

App.propTypes = {};

export default App;
