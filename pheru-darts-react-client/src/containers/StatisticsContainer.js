import {connect} from 'react-redux'
import Statistics from "../components/Statistics";
import {showLoginModal} from "../actions/user";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    users: state.users.all,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Statistics)
