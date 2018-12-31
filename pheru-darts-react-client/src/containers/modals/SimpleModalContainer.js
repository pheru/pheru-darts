import {connect} from 'react-redux'
import SimpleModal from "../../components/modals/SimpleModal";
import {hideCurrent} from "../../actions/modal";

const mapStateToProps = state => ({
    show: state.modal.show,
    item: state.modal.show ? state.modal.items[0] : {}
});

const mapDispatchToProps = dispatch => ({
    hide: () => dispatch(hideCurrent())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimpleModal)