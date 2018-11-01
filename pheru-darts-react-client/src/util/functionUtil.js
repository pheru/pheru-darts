export function ifEnterKey(action) {
    return ifKey(13, action);
}

export function ifEscKey(action) {
    return ifKey(27, action);
}

function ifKey(keyCode, action) {
    return function (target) {
        if (target.keyCode === keyCode) {
            action();
        }
    }
}