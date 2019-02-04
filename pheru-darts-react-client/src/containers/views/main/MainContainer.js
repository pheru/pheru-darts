import {connect} from 'react-redux'
import Main from "../../../components/views/main/Main";
import {logout, showLoginModal} from "../../../actions/user";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,

    gameRunning: state.game !== null,
    unreadNotificationsCount: state.notifications.unreadNotifications.length
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    logout: () => dispatch(logout())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)