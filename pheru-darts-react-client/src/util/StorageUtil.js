const SELECTED_VOICE_NAME = "selectedVoiceName";

export class LocalStorageUtil {
    static getSelectedVoiceName() {
        return localStorage.getItem(SELECTED_VOICE_NAME);
    }

    static setSelectedVoiceName(voiceName) {
        return localStorage.setItem(SELECTED_VOICE_NAME, voiceName);
    }
}