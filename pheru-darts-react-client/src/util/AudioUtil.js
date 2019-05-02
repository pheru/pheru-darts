// TODO Sieg-Sound
class AudioUtil {
    static playScoreButtonClick() {
        document.getElementById("audio_scorebutton_click").play();
    }

    static playUndo() {
        document.getElementById("audio_undo").play();
    }

    static playPlayerChange() {
        document.getElementById("audio_player_change").play();
    }

    static playOverthrown() {
        document.getElementById("audio_overthrown").play();
    }
}

export default AudioUtil;