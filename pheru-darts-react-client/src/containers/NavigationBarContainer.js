import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import {logout, showLoginModal} from "../actions/user";
import {showConfirmation} from "../actions/modal";
import {exitGame} from "../actions/game";
import NavigationBar from "../components/app/NavigationBar";

const mapStateToProps = state => ({
    userName: state.user.name,

    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,

    gameRunning: state.game !== null,

    unreadNotificationsCount: state.notifications.unreadNotifications.length
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    logout: () => dispatch(logout()),
    showConfirmation: (title, message, onConfirm, onCancel) => dispatch(showConfirmation(title, message, onConfirm, onCancel)),
    exitGame: () => dispatch(exitGame())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NavigationBar))