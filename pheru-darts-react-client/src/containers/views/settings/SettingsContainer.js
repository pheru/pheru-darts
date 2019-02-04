import {connect} from 'react-redux'
import Settings from "../../../components/views/settings/Settings";
import {setSelectedVoiceByName} from "../../../actions/speech";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,

    possibleVoices: state.speech.possibleVoices,
    selectedVoice: state.speech.selectedVoice,
    defaultVoice: state.speech.defaultVoice
});

const mapDispatchToProps = dispatch => ({
    setSelectedVoiceByName: (voiceName) => dispatch(setSelectedVoiceByName(voiceName))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)