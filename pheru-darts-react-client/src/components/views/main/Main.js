import React from 'react'
import PropTypes from 'prop-types';
import DocumentUtil from "../../../util/DocumentUtil";
import UnregisteredInfoPanel from "./UnregisteredInfoPanel";
import RegisteredInfoPanel from "./RegisteredInfoPanel";
import PlannedFeaturesInfoPanel from "./PlannedFeaturesInfoPanel";
import NewFeaturesInfoPanel from "./NewFeaturesInfoPanel";

class Main extends React.Component {

    componentDidMount() {
        DocumentUtil.setTitlePrefix("")
    }

    render() {
        return <div className="main">
            <h1>Pheru-Darts</h1>
            <div className="main-flex-row"
                 style={{alignItems: "flex-end", flexWrap: this.props.landscapeOrientation ? "inherit" : "wrap"}}>
                <UnregisteredInfoPanel/>
                <RegisteredInfoPanel showSignUpButton={!this.props.isLoggedIn && !this.props.isLoggingIn}
                                     onSignUp={this.props.showSignUp}/>
            </div>
            <div className="main-flex-row"
                 style={{alignItems: "start", flexWrap: this.props.landscapeOrientation ? "inherit" : "wrap"}}>
                <NewFeaturesInfoPanel truncated/>
                <PlannedFeaturesInfoPanel/>
            </div>
        </div>
    }
}

Main.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    landscapeOrientation: PropTypes.bool.isRequired,
    showSignUp: PropTypes.func.isRequired
};

export default Main