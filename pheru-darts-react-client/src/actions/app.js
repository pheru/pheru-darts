export const TOGGLE_NAVIGATION_BAR_VISIBILITY = "TOGGLE_NAVIGATION_BAR_VISIBILITY";
export const SET_NAVIGATION_BAR_VISIBILITY = "SET_NAVIGATION_BAR_VISIBILITY";
export const SET_LANDSCAPE_ORIENTATION = "SET_LANDSCAPE_ORIENTATION";

export const toggleNavigationBarVisibility = () => ({
    type: TOGGLE_NAVIGATION_BAR_VISIBILITY
});

export const setNavigationBarVisibility = (visibility) => ({
    type: SET_NAVIGATION_BAR_VISIBILITY,
    visibility
});

export const setLandscapeOrientation = (landscapeOrientation) => ({
    type: SET_LANDSCAPE_ORIENTATION,
    landscapeOrientation
});