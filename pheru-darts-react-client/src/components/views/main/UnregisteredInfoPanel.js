import React from 'react'
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import {Panel} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Glyphicon from "react-bootstrap/es/Glyphicon";

class UnregisteredInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="gift"/> Features ganz ohne Registrierung
            </Panel.Heading>
            <Panel.Body>
                <ul>
                    <li>
                        <NavLink to={NAVIGATION_ITEM.NEW_GAME.route}>
                            Darts-Rechner &#8203;
                        </NavLink>
                        inklusive Average- und Finish-Anzeige
                    </li>
                    <li>
                        Zum
                        <NavLink to={NAVIGATION_ITEM.NEW_TRAINING.route}>
                            &#8203; Trainieren &#8203;
                        </NavLink>
                        kannst Du auch einfach ein Spiel ohne Mitspieler erstellen
                    </li>
                    <li>
                        Auch für die Verwendung auf mobilen Geräten geeignet
                    </li>
                </ul>
            </Panel.Body>
        </Panel>
    }
}

UnregisteredInfoPanel.propTypes = {};

export default UnregisteredInfoPanel