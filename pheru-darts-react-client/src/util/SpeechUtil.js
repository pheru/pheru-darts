class SpeechUtil {
    static speak(text, voice) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;

        // Ein speak direkt nach einem cancel wird nicht ausgeführt, daher eine kleine Pause einfügen
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setTimeout(function () { window.speechSynthesis.speak(utterance); }, 250);
        } else {
            window.speechSynthesis.speak(utterance);
        }
    }
}

export default SpeechUtil;