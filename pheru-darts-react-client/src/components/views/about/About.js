import React from 'react'
import PropTypes from "prop-types";
import NewFeaturesInfoPanel from "../main/NewFeaturesInfoPanel";

class About extends React.Component {

    componentDidMount() {
        this.props.fetchServerVersion();
    }

    render() {
        return <div>
            <NewFeaturesInfoPanel/>
        </div>
    }

}

About.propTypes = {
    fetchServerVersion: PropTypes.func.isRequired,
    serverVersion: PropTypes.string
};

export default About