import {connect} from 'react-redux'
import Users from "../components/Users";
import {addUser} from "../actions/users";

const mapStateToProps = state => ({
    users: state.users.all,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching,
    addingFailed: state.users.addingFailed,
    addingFailedMessage: state.users.addingFailedMessage,
    isAdding: state.users.isAdding
});

const mapDispatchToProps = dispatch => ({
    addUser : (user) => dispatch(addUser(user))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users)
