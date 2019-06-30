class KeyUtil {
    static ifEnterKey(action) {
        return ifKey(13, action);
    }

    static ifEscKey(action) {
        return ifKey(27, action);
    }
}

function ifKey(keyCode, action) {
    return function (event) {
        if (event.keyCode === keyCode) {
            action();
        }
    }
}

export default KeyUtil;