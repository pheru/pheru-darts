import React from 'react'
import './stackloader.css'
import PropTypes from "prop-types";

class StackLoader extends React.Component {

    render() {
        return <div className="stack-loader-container">
            <i className="stack-loader-layer"/>
            <i className="stack-loader-layer"/>
            <i className="stack-loader-layer"/>
            <p className="stack-loader-label"><strong>{this.props.label}</strong></p>
        </div>;
    }
}

StackLoader.propTypes = {
    label: PropTypes.string,
};

export default StackLoader;