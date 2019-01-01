import React from 'react'
import PropTypes from 'prop-types';
import {FormControl} from "react-bootstrap";

class SpeechSettings extends React.Component {

    render() {
        return <div style={{...this.props.style}}>
            <FormControl componentClass="select" style={{width: 400, maxWidth: "95%", display: "initial"}}
                         onChange={(e) => {
                             this.props.onSelectedVoiceChange(e.target.value);
                         }}
                         value={this.props.selectedVoice ? this.props.selectedVoice.name : undefined}>
                {this.props.possibleVoices.map(possibleVoice => {
                        let key = "possible_voice_" + possibleVoice.name;
                        return <option key={key} value={possibleVoice.name}>{possibleVoice.name}</option>
                    }
                )}
            </FormControl>
        </div>
    }
}

SpeechSettings.propTypes = {
    possibleVoices: PropTypes.array.isRequired,
    selectedVoice: PropTypes.object,
    onSelectedVoiceChange: PropTypes.func.isRequired
};

export default SpeechSettings