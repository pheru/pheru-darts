import {connect} from 'react-redux'
import {showLoginModal} from "../../actions/user";
import OnlyForLoggedInUsers from "../../components/general/OnlyForLoggedInUsers";

const mapStateToProps = (state, ownProps) => ({
    text: ownProps.text,
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnlyForLoggedInUsers)