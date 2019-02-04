class DocumentUtil {
    static setTitlePrefix(titlePrefix) {
        let prefix = titlePrefix ? titlePrefix + " - " : "";
        document.title = prefix + "Pheru-Darts";
    }
}

export default DocumentUtil;