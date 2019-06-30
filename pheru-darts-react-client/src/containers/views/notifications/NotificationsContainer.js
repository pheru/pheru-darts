import {connect} from 'react-redux'
import Notifications from "../../../components/views/notifications/Notifications";
import {fetchNotifications, markNotificationsAsRead} from "../../../actions/notifications";
import {showLoginModal} from "../../../actions/user";

const mapStateToProps = state => ({
    notifications: state.notifications.notifications.slice().reverse(),
    unreadNotifications: state.notifications.unreadNotifications,
    isFetchingNotifications: state.notifications.isFetching
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    fetchNotifications: () => dispatch(fetchNotifications()),
    markAsRead: (ids) => dispatch(markNotificationsAsRead(ids))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notifications)