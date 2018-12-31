export const SET_POSSIBLE_VOICES = "SET_POSSIBLE_VOICES";
export const SET_SELECTED_VOICE_BY_NAME = "SET_SELECTED_VOICE_BY_NAME";
export const TOGGLE_SPEECH_OUTPUT = "TOGGLE_SPEECH_OUTPUT";

export const setPossibleVoices = (voices) => ({
    type: SET_POSSIBLE_VOICES,
    voices
});
export const setSelectedVoiceByName = (voiceName) => ({
    type: SET_SELECTED_VOICE_BY_NAME,
    voiceName
});
export const toggleSpeechOutput = () => ({
    type: TOGGLE_SPEECH_OUTPUT
});