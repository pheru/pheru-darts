import {connect} from 'react-redux'
import PermissionSettings from "../../../components/views/settings/PermissionSettings";
import {addPlayerPermissionById, addPlayerPermissionByName, removePlayerPermission} from "../../../actions/playerPermission";
import SortUtil from "../../../util/SortUtil";

const mapStateToProps = state => ({
    userId: state.user.id,

    playableUsers: state.playerPermission.playableUsers.slice().sort(SortUtil.sortPlayerByNameAsc),
    fetchPlayableUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    isFetchingPlayableUsers: state.playerPermission.isFetchingPlayableUsers,

    permittedUsers: state.playerPermission.permittedUsers.slice().sort(SortUtil.sortPlayerByNameAsc),
    fetchPermittedUsersFailed: state.playerPermission.fetchPermittedUsersFailed,
    isFetchingPermittedUsers: state.playerPermission.isFetchingPermittedUsers,

    isUpdatingPlayerPermission: state.playerPermission.isUpdatingPlayerPermission
});

const mapDispatchToProps = dispatch => ({
    addPlayerPermissionById: (userId) => dispatch(addPlayerPermissionById(userId)),
    addPlayerPermissionByName: (username) => dispatch(addPlayerPermissionByName(username)),
    removePlayerPermission: (userId) => dispatch(removePlayerPermission(userId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PermissionSettings)