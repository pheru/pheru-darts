import {TYPE_ERROR, TYPE_INFORMATION, TYPE_WARNING, TYPE_CONFIRMATION} from "../components/modals/SimpleModal";

export const HIDE_CURRENT_MODAL = "HIDE_CURRENT_MODAL";
export const SHOW_MODAL = "SHOW_MODAL";

export const hideCurrent = () => ({
    type: HIDE_CURRENT_MODAL
});

export const showConfirmation = (title, message, onConfirm, onCancel) => ({
    type: SHOW_MODAL,
    modalType: TYPE_CONFIRMATION,
    title,
    message,
    onConfirm,
    onCancel
});
export const showInformation = (title, message) => ({
    type: SHOW_MODAL,
    modalType: TYPE_INFORMATION,
    title,
    message
});
export const showWarning = (title, message) => ({
    type: SHOW_MODAL,
    modalType: TYPE_WARNING,
    title,
    message
});
export const showError = (title, message) => ({
    type: SHOW_MODAL,
    modalType: TYPE_ERROR,
    title,
    message
});