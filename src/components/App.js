import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Alert, Glyphicon, Nav, Navbar, NavItem} from "react-bootstrap";
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import GameContainer from "../containers/GameContainer";
import {GAME_ROUTE, NEW_GAME_ROUTE, STATISTICS_ROUTE, USERS_ROUTE} from "../constants/routes";
import StatisticsContainer from "../containers/StatisticsContainer";
import UsersContainer from "../containers/UsersContainer";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertDismissed: false
        };
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    componentDidMount() {
        window.onbeforeunload = this.onBeforeUnload;
        this.props.fetchAllUsers();
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
                    <ul>
                        <li>Statistiken stehen nicht zur Verfügung</li>
                        <li>Spielerverwaltung steht nicht zur Verfügung</li>
                        <li>Spiel nur mit unregistrierten Benutzern möglich (keine Erfassung von Statistiken)</li>
                    </ul>
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
                    <Route path={USERS_ROUTE} component={UsersContainer}/>
                    {/*no-match-route*/}
                    <Route render={() => <Redirect to={NEW_GAME_ROUTE}/>}/>
                </Switch>
            </div>
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
                        <NavItem disabled={this.props.isFetchingUsers || this.props.fetchAllUsersFailed}>
                            <Glyphicon glyph="stats"/> Statistiken
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to={USERS_ROUTE}>
                        <NavItem disabled={this.props.isFetchingUsers || this.props.fetchAllUsersFailed}>
                            <Glyphicon glyph="user"/> Spielerverwaltung
                        </NavItem>
                    </LinkContainer>
                </Nav>
                {this.props.gameRunning && this.props.location.pathname !== GAME_ROUTE &&
                <Nav pullRight>
                    <LinkContainer to={GAME_ROUTE}>
                        <NavItem>Zurück zum Spiel <Glyphicon glyph="share-alt"/></NavItem>
                    </LinkContainer>
                </Nav>
                }
            </Navbar.Collapse>
        </Navbar>;
    }
}

App.propTypes = {};

export default App;
