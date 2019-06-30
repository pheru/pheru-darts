import React from 'react'
import './stackloader.css'
import PropTypes from "prop-types";

class StackLoader extends React.Component {

    render() {
        let loader = <div className="stack-loader-container">
            <i className="stack-loader-layer"/>
            <i className="stack-loader-layer"/>
            <i className="stack-loader-layer"/>
            <p className="stack-loader-label"><strong>{this.props.label}</strong></p>
        </div>;
        return this.props.modal
            ? <div style={{
                zIndex: 980,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#000000bd"
            }}>
                <div style={{zIndex: 990, position: "fixed", left: "50%", top: "50%", color: "white"}}>
                    {loader}
                </div>
            </div>
            : loader;
    }
}

StackLoader.propTypes = {
    label: PropTypes.string,
    modal: PropTypes.bool
};

export default StackLoader;