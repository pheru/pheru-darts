import React from 'react'
import PropTypes from 'prop-types';
import {Alert, FormControl} from "react-bootstrap";

class SpeechSettings extends React.Component {

    render() {
        return <div style={{...this.props.style}}>
            <h3 style={{marginTop: 0}}><strong>Spracheinstellungen</strong></h3>
            <Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5, textAlign: 'center'}}>
                Diese Einstellungen sind abhängig vom verwendeten Endgerät und Browser.<br/>
                Daher werden sie nicht in Deinem Benutzerkonto gespeichert, sondern in Deinem Browser.
            </Alert>
            <p style={{marginBottom: 0}}><strong>Sprache:</strong></p>
            <FormControl componentClass="select" style={{width: 400, maxWidth: "95%", display: "initial"}}
                         onChange={(e) => {
                             this.props.onSelectedVoiceChange(e.target.value);
                         }}
                         value={this.props.selectedVoice
                             ? this.props.selectedVoice.name
                             : this.props.defaultVoice
                                 ? this.props.defaultVoice.name
                                 : undefined}>
                {this.props.possibleVoices.map(possibleVoice => {
                        let key = "possible_voice_" + possibleVoice.name;
                        return <option key={key}
                                       value={possibleVoice.name}>{possibleVoice.name} {possibleVoice.default && "[Standard]"}</option>
                    }
                )}
            </FormControl>
        </div>
    }
}

SpeechSettings.propTypes = {
    possibleVoices: PropTypes.array.isRequired,
    selectedVoice: PropTypes.object,
    defaultVoice: PropTypes.object,
    onSelectedVoiceChange: PropTypes.func.isRequired
};

export default SpeechSettings