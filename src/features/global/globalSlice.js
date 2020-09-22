import { createSlice } from "@reduxjs/toolkit";

export const SettingsState = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
};

export const globalSlice = createSlice({
    name: "global",
    initialState: { settings: getSettings(), showSettings: false },
    reducers: {
        settingsChanged: (state, action) => {
            state.settings = {
                state: SettingsState.PRESENT,
                settings: action.payload,
            };
        },
        showSettingsDialog: (state) => {
            state.showSettings = true;
        },
        hideSettingsDialog: (state) => {
            state.showSettings = false;
        },
    },
});

export const {
    settingsChanged,
    showSettingsDialog,
    hideSettingsDialog,
} = globalSlice.actions;
export const areSettingsPresent = (state) =>
    state.global.settings.state === SettingsState.PRESENT;

export const shouldShowSettings = (state) =>
    state.global.settings.state === SettingsState.ABSENT ||
    state.global.showSettings;

export default globalSlice.reducer;

export const saveSettings = (settings) => {
    return async (dispatch) => {
        try {
            storeSettings({ settings });

            dispatch(settingsChanged(settings));
        } catch (err) {
            console.error(err);
        }
    };
};

// Store to/from local storage
export function getSettings() {
    const settingsJSON = localStorage.getItem("beets:settings");

    if (!settingsJSON) {
        return { state: SettingsState.ABSENT, settings: null };
    } else {
        return {
            state: SettingsState.PRESENT,
            settings: JSON.parse(settingsJSON),
        };
    }
}

function storeSettings(settings) {
    localStorage.setItem("beets:settings", JSON.stringify(settings.settings));
}
