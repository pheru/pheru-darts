import {connect} from 'react-redux'
import {fetchServerVersion} from "../actions/serverInformation";
import About from "../components/About";

const mapStateToProps = state => ({
    serverVersion: state.serverInformation.version,
    isFetchingServerVersion: state.serverInformation.isFetchingVersion
});

const mapDispatchToProps = dispatch => ({
    fetchServerVersion: () => dispatch(fetchServerVersion())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)