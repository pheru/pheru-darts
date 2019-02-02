import React from 'react'
import PropTypes from "prop-types";

class About extends React.Component {

    componentDidMount() {
        this.props.fetchServerVersion();
    }

    render() {
        return <div>
            Client: {`${process.env.REACT_APP_VERSION}`} <br/>
            Server: {this.props.serverVersion ? this.props.serverVersion : "Lade..."}
        </div>
    }

}

About.propTypes = {
    fetchServerVersion: PropTypes.func.isRequired,
    serverVersion: PropTypes.string
};

export default About