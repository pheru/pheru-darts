import React from 'react'
import {Alert, Button, Glyphicon} from "react-bootstrap";

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
            {this.props.isLoggedIn
                ? this.createStatisticsView()
                : <Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5}}>
                        <Glyphicon glyph="exclamation-sign"/> <strong>Nur für angemeldete Benutzer können Statistiken erstellt und eingesehen werden </strong>
                    <Button bsStyle="primary" onClick={this.props.showLogin}><Glyphicon glyph="log-in"/> Anmelden</Button>
                </Alert>
            }
        </div>
    }

    createStatisticsView() {
        return <h1>Statistiken</h1>
    }

}

Statistics.propTypes = {};

export default Statistics;
