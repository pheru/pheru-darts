import {connect} from 'react-redux'
import Users from "../components/Users";

const mapStateToProps = state => ({
    users: state.users.all,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users)
