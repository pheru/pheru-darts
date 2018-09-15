import {connect} from 'react-redux'
import Settings from "../components/Settings";
import {filterUserByIds} from "../services/userFilterService";
import {showLoginModal} from "../actions/user";
import {addPlayerPermission, removePlayerPermission} from "../actions/playerPermission";
import {sortPlayerByNameAsc} from "../services/sortService";

const mapStateToProps = state => ({
    userId: state.user.id,
    userName: state.user.name,
    isLoggedIn: state.user.isLoggedIn,
    users: state.users.all.slice().sort(sortPlayerByNameAsc),
    playableUsers: filterUserByIds(state.users.all, state.playerPermission.playableUserIds),
    authorizedUsers: filterUserByIds(state.users.all, state.playerPermission.permittedUserIds),
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching,
    isUpdatingPlayerPermission: state.playerPermission.isUpdatingPlayerPermission
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    addPlayerPermission: (userId) => dispatch(addPlayerPermission(userId)),
    removePlayerPermission: (userId) => dispatch(removePlayerPermission(userId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)
