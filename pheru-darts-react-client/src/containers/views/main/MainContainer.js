import {connect} from 'react-redux'
import Main from "../../../components/views/main/Main";
import {showSignUpModal} from "../../../actions/user";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    landscapeOrientation: state.app.landscapeOrientation,
});

const mapDispatchToProps = dispatch => ({
    showSignUp: () => dispatch(showSignUpModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)