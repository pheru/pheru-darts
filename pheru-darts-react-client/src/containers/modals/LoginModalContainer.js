import {connect} from 'react-redux'
import LoginModal from "../../components/modals/LoginModal";
import {hideLoginModal, login, showSignUpModal} from "../../actions/user";

const mapStateToProps = state => ({
    show: state.user.showLoginModal,
    isLoggingIn: state.user.isLoggingIn
});

const mapDispatchToProps = dispatch => ({
    login: (name, password) => dispatch(login(name, password)),
    hide: () => dispatch(hideLoginModal()),
    showSignUp: () => dispatch(showSignUpModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal)