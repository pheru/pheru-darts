import {connect} from 'react-redux'
import Settings from "../components/views/settings/Settings";
import {showLoginModal} from "../actions/user";
import {addPlayerPermissionById, addPlayerPermissionByName, removePlayerPermission} from "../actions/playerPermission";
import {sortPlayerByNameAsc} from "../services/sortService";
import {setSelectedVoiceByName} from "../actions/speech";

const mapStateToProps = state => ({
    userId: state.user.id,
    userName: state.user.name,
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,

    playableUsers: state.playerPermission.playableUsers.sort(sortPlayerByNameAsc),
    fetchPlayableUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    isFetchingPlayableUsers: state.playerPermission.isFetchingPlayableUsers,

    permittedUsers: state.playerPermission.permittedUsers.sort(sortPlayerByNameAsc),
    fetchPermittedUsersFailed: state.playerPermission.fetchPermittedUsersFailed,
    isFetchingPermittedUsers: state.playerPermission.isFetchingPermittedUsers,

    isUpdatingPlayerPermission: state.playerPermission.isUpdatingPlayerPermission,

    possibleVoices: state.speech.possibleVoices,
    selectedVoice: state.speech.selectedVoice,
    defaultVoice: state.speech.defaultVoice
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    addPlayerPermissionById: (userId) => dispatch(addPlayerPermissionById(userId)),
    addPlayerPermissionByName: (username) => dispatch(addPlayerPermissionByName(username)),
    removePlayerPermission: (userId) => dispatch(removePlayerPermission(userId)),
    setSelectedVoiceByName: (voiceName) => dispatch(setSelectedVoiceByName(voiceName))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)