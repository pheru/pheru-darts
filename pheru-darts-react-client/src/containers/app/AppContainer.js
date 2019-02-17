import {connect} from 'react-redux'
import App from "../../components/app/App";
import {withRouter} from "react-router-dom";
import {loginByToken, logout, showLoginModal} from "../../actions/user";
import {fetchPermittedUsers, fetchPlayableUsers} from "../../actions/playerPermission";
import {showConfirmation} from "../../actions/modal";
import {exitGame} from "../../actions/game";
import {setPossibleVoices, setSelectedVoiceByName} from "../../actions/speech";

const mapStateToProps = state => ({
    userName: state.user.name,

    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isLoggingOut: state.user.isLoggingOut,

    navigationBarVisible: state.app.navigationBarVisible,

    gameRunning: state.game !== null,

    fetchPlayableUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    fetchPermittedUsersFailed: state.playerPermission.fetchPermittedUsersFailed,

    unreadNotificationsCount: state.notifications.unreadNotifications.length,

    selectedVoice: state.speech.selectedVoice
});

const mapDispatchToProps = dispatch => ({
    fetchPlayableUsers : () => dispatch(fetchPlayableUsers()),
    fetchPermittedUsers : () => dispatch(fetchPermittedUsers()),
    showLogin: () => dispatch(showLoginModal()),
    loginByToken: (showErrorOnFailure) => dispatch(loginByToken(showErrorOnFailure)),
    logout: () => dispatch(logout()),
    showConfirmation: (title, message, onConfirm, onCancel) => dispatch(showConfirmation(title, message, onConfirm, onCancel)),
    exitGame: () => dispatch(exitGame()),
    setPossibleVoices: (voices) => dispatch(setPossibleVoices(voices)),
    setSelectedVoiceByName: (voice) => dispatch(setSelectedVoiceByName(voice))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))