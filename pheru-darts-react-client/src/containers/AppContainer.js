import {connect} from 'react-redux'
import App from "../components/app/App";
import {withRouter} from "react-router-dom";
import {loginByToken, logout, showLoginModal} from "../actions/user";
import {fetchPermittedUsers, fetchPlayableUsers} from "../actions/playerPermission";
import {showConfirmation} from "../actions/modal";
import {exitGame} from "../actions/game";

const mapStateToProps = state => ({
    userId: state.user.id,
    userName: state.user.name,

    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,

    gameRunning: state.game !== null,

    fetchPlayableUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    fetchPermittedUsersFailed: state.playerPermission.fetchPermittedUsersFailed,

    unreadNotificationsCount: state.notifications.unreadNotifications.length
});

const mapDispatchToProps = dispatch => ({
    fetchPlayableUsers : () => dispatch(fetchPlayableUsers()),
    fetchPermittedUsers : () => dispatch(fetchPermittedUsers()),
    showLogin: () => dispatch(showLoginModal()),
    loginByToken: (showErrorOnFailure) => dispatch(loginByToken(showErrorOnFailure)),
    logout: () => dispatch(logout()),
    showConfirmation: (title, message, onConfirm, onCancel) => dispatch(showConfirmation(title, message, onConfirm, onCancel)),
    exitGame: () => dispatch(exitGame()),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))