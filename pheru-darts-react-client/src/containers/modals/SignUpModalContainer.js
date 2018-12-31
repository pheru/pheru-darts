import {connect} from 'react-redux'
import SignUpModal from "../../components/modals/SignUpModal";
import {hideSignUpModal, signUp} from "../../actions/user";

const mapStateToProps = state => ({
    show: state.user.showSignUpModal,
    isSigningUp: state.user.isSigningUp
});

const mapDispatchToProps = dispatch => ({
    signUp: (name, password) => dispatch(signUp(name, password)),
    hide: () => dispatch(hideSignUpModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpModal)