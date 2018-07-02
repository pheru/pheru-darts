import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import LoginModal from "../../components/modals/LoginModal";
import {hideLoginModal, login, showSignUpModal} from "../../actions/user";

const mapStateToProps = state => ({
    show: state.user.showLoginModal,
    isLoggingIn: state.user.isLoggingIn,
    loginFailedMessage: state.user.loginFailedMessage
});

const mapDispatchToProps = dispatch => ({
    login: (name, password) => dispatch(login(name, password)),
    hide: () => dispatch(hideLoginModal()),
    showSignUp: () => dispatch(showSignUpModal())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal))
