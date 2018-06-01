import React from 'react'
import GameContainer from "../containers/GameContainer";
import Navbar from "react-bootstrap/es/Navbar";
import NewGameConfigContainer from "../containers/NewGameConfigContainer";
import NavItem from "react-bootstrap/es/NavItem";
import Nav from "react-bootstrap/es/Nav";
import {Redirect, Route} from "react-router-dom";
import Statistics from "./Statistics";
import Users from "./Users";
import {LinkContainer} from "react-router-bootstrap";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldNavbarBeRendered() {
        return this.props.location.pathname !== "/game";
    }

    render() {
        return <div>
            {this.shouldNavbarBeRendered() && this.createNavbar()}
            <div style={{paddingTop: this.shouldNavbarBeRendered() ? 60 : 0}}>
                <Route exact path="/" render={() => <Redirect to="/newgame"/>}/>
                <Route path="/newgame" component={NewGameConfigContainer}/>
                <Route path="/game"
                       render={() => this.props.gameRunning
                           ? <div style={{paddingTop: 10}}><GameContainer/></div>
                           : <Redirect to="/newgame"/>
                       }
                />
                <Route path="/statistics" component={Statistics}/>
                <Route path="/users" component={Users}/>
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
                    <LinkContainer to="/newgame">
                        <NavItem>Neues Spiel</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/statistics">
                        <NavItem>Statistiken</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/users">
                        <NavItem>Spielerverwaltung</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
}

App.propTypes = {};

export default App;
