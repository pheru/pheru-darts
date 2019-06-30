import {connect} from 'react-redux'
import SignUpModal from "../../components/modals/SignUpModal";
import {hideSignUpModal, showLoginModal, signUp} from "../../actions/user";

const mapStateToProps = state => ({
    show: state.user.showSignUpModal,
    isSigningUp: state.user.isSigningUp
});

const mapDispatchToProps = dispatch => ({
    signUp: (name, password) => dispatch(signUp(name, password)),
    hide: () => dispatch(hideSignUpModal()),
    showLogin: () => dispatch(showLoginModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpModal)