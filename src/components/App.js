import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Glyphicon, Nav, Navbar, NavItem} from "react-bootstrap";
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import GameContainer from "../containers/GameContainer";
import Statistics from "./Statistics";
import Users from "./Users";
import {GAME_ROUTE, NEW_GAME_ROUTE, STATISTICS_ROUTE, USERS_ROUTE} from "../constants/routes";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
    }

    componentDidMount() {
        window.onbeforeunload = this.onBeforeUnload;
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

    render() {
        return <div>
            {this.createNavbar()}
            <div style={{paddingTop: 60}}>
                <Switch>
                    <Route path={NEW_GAME_ROUTE} component={NewGameConfigContainer}/>
                    <Route path={GAME_ROUTE}
                           render={() => this.props.gameRunning
                               ? <div style={{paddingTop: 10}}><GameContainer/></div>
                               : <Redirect to={NEW_GAME_ROUTE}/>
                           }
                    />
                    <Route path={STATISTICS_ROUTE} component={Statistics}/>
                    <Route path={USERS_ROUTE} component={Users}/>
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
                        <NavItem>Neues Spiel</NavItem>
                    </LinkContainer>
                    <LinkContainer to={STATISTICS_ROUTE}>
                        <NavItem>Statistiken</NavItem>
                    </LinkContainer>
                    <LinkContainer to={USERS_ROUTE}>
                        <NavItem>Spielerverwaltung</NavItem>
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
