export const HIDE_CURRENT_ERROR = "HIDE_CURRENT_ERROR";
export const SHOW_ERROR = "SHOW_ERROR";

export const hideCurrentError = () => ({
    type: HIDE_CURRENT_ERROR
});

export const showError = (title, message) => ({
    type: SHOW_ERROR,
    title,
    message
});