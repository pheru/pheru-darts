import {SET_POSSIBLE_VOICES, SET_SELECTED_VOICE_BY_NAME, TOGGLE_SPEECH_OUTPUT} from "../actions/speech";

function speech(state = {
    possibleVoices: [],
    selectedVoice: undefined,
    defaultVoice: undefined,
    speechOutputActive: false
}, action) {
    switch (action.type) {
        case SET_POSSIBLE_VOICES: {
            let defaultVoice = undefined;
            for (let i = 0; i < action.voices.length; i++) {
                if (action.voices[i].default) {
                    defaultVoice = action.voices[i];
                }
            }
            return {
                ...state,
                defaultVoice: defaultVoice,
                possibleVoices: action.voices.slice()
            };
        }
        case SET_SELECTED_VOICE_BY_NAME: {
            let newSelectedVoice = state.selectedVoice;
            for (let i = 0; i < state.possibleVoices.length; i++) {
                if (state.possibleVoices[i].name === action.voiceName) {
                    newSelectedVoice = state.possibleVoices[i];
                }
            }
            return {
                ...state,
                selectedVoice: newSelectedVoice
            };
        }
        case TOGGLE_SPEECH_OUTPUT: {
            return {
                ...state,
                speechOutputActive: !state.speechOutputActive
            };
        }
        default:
            return state
    }
}

export default speech