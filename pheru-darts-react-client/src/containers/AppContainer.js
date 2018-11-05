import {connect} from 'react-redux'
import App from "../components/App";
import {withRouter} from "react-router-dom";
import {loginByToken, logout, showLoginModal} from "../actions/user";
import {fetchPermittedUsers, fetchPlayableUsers} from "../actions/playerPermission";

const mapStateToProps = state => ({
    userId: state.user.id,
    userName: state.user.name,

    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,

    gameRunning: state.game !== null,

    fetchPlayableUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    fetchPermittedUsersFailed: state.playerPermission.fetchPermittedUsersFailed
});

const mapDispatchToProps = dispatch => ({
    fetchPlayableUsers : () => dispatch(fetchPlayableUsers()),
    fetchPermittedUsers : () => dispatch(fetchPermittedUsers()),
    showLogin: () => dispatch(showLoginModal()),
    loginByToken: (showErrorOnFailure) => dispatch(loginByToken(showErrorOnFailure)),
    logout: () => dispatch(logout())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))