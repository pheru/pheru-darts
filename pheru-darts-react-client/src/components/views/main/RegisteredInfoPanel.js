import React from 'react'
import PropTypes from "prop-types";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import {Button, Panel} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import Glyphicon from "react-bootstrap/es/Glyphicon";

class RegisteredInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="plus"/> Zusätzliche Vorteile für registrierte Nutzer
            </Panel.Heading>
            <Panel.Body>
                <ul>
                    <li>
                        Ausführliche
                        <NavLink to={NAVIGATION_ITEM.STATISTICS.route}>
                            &#8203; Statistiken &#8203;
                        </NavLink>
                        zu allen Spielen, an welchen Du teilgenommen hast
                    </li>
                    <li>
                        Lege mithilfe des
                        <NavLink to={NAVIGATION_ITEM.SETTINGS_PERMISSIONS.route}>
                            &#8203; Berechtigungssystems &#8203;
                        </NavLink>
                        fest, welche Benutzer Spiele mit Dir erstellen dürfen
                    </li>
                    <li>
                        Erhalte
                        <NavLink to={NAVIGATION_ITEM.NOTIFICATIONS.route}>
                            &#8203; Benachrichtigungen &#8203;
                        </NavLink>
                        für relevante Ereignisse (z.B. wenn ein anderer Benutzer ein Spiel mit Dir gespeichert
                        hat)
                    </li>
                </ul>
                {this.props.showSignUpButton &&
                <Button bsStyle="primary" style={{marginTop: 10}} onClick={this.props.onSignUp}>
                    Jetzt registrieren
                </Button>
                }
            </Panel.Body>
        </Panel>
    }
}

RegisteredInfoPanel.propTypes = {
    showSignUpButton: PropTypes.bool.isRequired,
    onSignUp: PropTypes.func.isRequired,
};

export default RegisteredInfoPanel