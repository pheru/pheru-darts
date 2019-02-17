export const TOGGLE_NAVIGATION_BAR_VISIBILITY = "TOGGLE_NAVIGATION_BAR_VISIBILITY";
export const SET_NAVIGATION_BAR_VISIBILITY = "SET_NAVIGATION_BAR_VISIBILITY";

export const toggleNavigationBarVisibility = () => ({
    type: TOGGLE_NAVIGATION_BAR_VISIBILITY
});

export const setNavigationBarVisibility = (visibility) => ({
    type: SET_NAVIGATION_BAR_VISIBILITY,
    visibility
});