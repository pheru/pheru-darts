import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import SignUpModal from "../../components/modals/SignUpModal";
import {hideSignUpModal, signUp} from "../../actions/user";

const mapStateToProps = state => ({
    show: state.user.showSignUpModal,
    isSigningUp: state.user.isSigningUp,
    signUpFailedMessage: state.user.signUpFailedMessage
});

const mapDispatchToProps = dispatch => ({
    signUp: (name, password) => dispatch(signUp(name, password)),
    hide: () => dispatch(hideSignUpModal())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpModal))
