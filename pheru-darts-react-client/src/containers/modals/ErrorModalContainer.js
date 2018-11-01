import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import ErrorModal from "../../components/modals/ErrorModal";
import {hideCurrentError} from "../../actions/errors";

const mapStateToProps = state => ({
    show: state.errors.show,
    error: state.errors.show ? state.errors.errors[0] : {title: "", text: ""}
});

const mapDispatchToProps = dispatch => ({
    hide: () => dispatch(hideCurrentError())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorModal))