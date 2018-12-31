const SELECTED_VOICE_NAME = "selectedVoiceName";

export let localStorageService = {
    getSelectedVoiceName() {
        return localStorage.getItem(SELECTED_VOICE_NAME);
    },
    setSelectedVoiceName(voiceName) {
        return localStorage.setItem(SELECTED_VOICE_NAME, voiceName);
    }
};