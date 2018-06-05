import {connect} from 'react-redux'
import Statistics from "../components/Statistics";

const mapStateToProps = state => ({
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Statistics)
