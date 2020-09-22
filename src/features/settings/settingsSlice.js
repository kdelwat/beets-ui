import { createSlice } from "@reduxjs/toolkit";
import { getSettings } from "../global/globalSlice";
import Api from "../../api/api";

export const SettingsTestStatus = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    NOT_RUN: "NOT_RUN",
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        url: "",
        basicAuthEnabled: false,
        username: "",
        password: "",
        test: { status: SettingsTestStatus.NOT_RUN },
    },
    reducers: {
        changeUrl: (state, action) => {
            state.url = action.payload;
            state.test = { status: SettingsTestStatus.NOT_RUN };
        },
        changeBasicAuthEnabled: (state, action) => {
            state.basicAuthEnabled = action.payload;
            state.test = { status: SettingsTestStatus.NOT_RUN };
        },
        changeUsername: (state, action) => {
            state.username = action.payload;
            state.test = { status: SettingsTestStatus.NOT_RUN };
        },
        changePassword: (state, action) => {
            state.password = action.payload;
            state.test = { status: SettingsTestStatus.NOT_RUN };
        },
        completedTest: (state, action) => {
            if (action.payload.result) {
                state.test = { status: SettingsTestStatus.SUCCESS };
            } else {
                state.test = {
                    status: SettingsTestStatus.FAILED,
                    error: action.payload.err,
                };
            }
        },
    },
});

export const loadSettings = () => {
    return async (dispatch) => {
        try {
            const settings = getSettings();

            dispatch(changeUrl(settings.settings.url));

            if (settings.settings.basicAuth) {
                dispatch(changeBasicAuthEnabled(true));
                dispatch(changePassword(settings.settings.password));
                dispatch(changeUsername(settings.settings.username));
            } else {
                dispatch(changeBasicAuthEnabled(false));
            }
        } catch (err) {
            console.error(err);
        }
    };
};

export const {
    changeUrl,
    changeBasicAuthEnabled,
    changeUsername,
    changePassword,
    completedTest,
} = settingsSlice.actions;

export const isBasicAuthEnabled = (state) => state.settings.basicAuthEnabled;

export const selectWipSettings = (state) => {
    return {
        url: state.settings.url,
        basicAuthEnabled: state.settings.basicAuthEnabled,
        username: state.settings.username,
        password: state.settings.password,
    };
};

export const testNewSettings = () => {
    return async (dispatch, getState) => {
        try {
            const newSettings = selectNewSettings(getState());

            const api = new Api({
                global: { settings: { settings: newSettings } },
            });

            const stats = await api.getStats();

            if (stats) {
                dispatch(completedTest({ result: true }));
            } else {
                dispatch(
                    completedTest({ result: false, err: "Could not connect" })
                );
            }
        } catch (err) {
            console.error(err);

            dispatch(completedTest({ result: false, err: err.message }));
        }
    };
};

export const selectNewSettings = (state) => {
    if (state.settings.url === "") {
        return null;
    }

    if (state.settings.basicAuthEnabled && state.settings.username === "") {
        return null;
    }

    return {
        url: state.settings.url,
        basicAuth: state.settings.basicAuthEnabled
            ? {
                  username: state.settings.username,
                  password: state.settings.password,
              }
            : null,
    };
};

export const selectTestStatus = (state) => {
    return state.settings.test;
};

export default settingsSlice.reducer;
