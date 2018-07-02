import {connect} from 'react-redux'
import App from "../components/App";
import {withRouter} from "react-router-dom";
import {fetchAllUsers} from "../actions/users";
import {loginByToken, logout, showLoginModal} from "../actions/user";
import {fetchPermittedUsers, fetchPlayableUsers} from "../actions/playerPermission";

const mapStateToProps = state => ({
    userId: state.user.id,
    userName: state.user.name,
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
    fetchAllUsers : () => dispatch(fetchAllUsers()),
    fetchPlayableUsers : (id) => dispatch(fetchPlayableUsers(id)),
    fetchPermittedUsers : (id) => dispatch(fetchPermittedUsers(id)),
    showLogin: () => dispatch(showLoginModal()),
    loginByToken: () => dispatch(loginByToken()),
    logout: () => dispatch(logout())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))
