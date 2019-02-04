import {connect} from 'react-redux'
import {deleteUser, modifyUser} from "../../../actions/user";
import UserSettings from "../../../components/views/settings/UserSettings";

const mapStateToProps = state => ({
    userName: state.user.name,
    isModifyingUser: state.user.isModifying,
    isDeletingUser: state.user.isDeletingUser
});

const mapDispatchToProps = dispatch => ({
    modifyUser: (currentPassword, newName, newPassword) => dispatch(modifyUser(currentPassword, newName, newPassword)),
    deleteUser: (currentPassword) => dispatch(deleteUser(currentPassword))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSettings)