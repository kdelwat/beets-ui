import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        url: "",
        basicAuthEnabled: false,
        username: "",
        password: "",
    },
    reducers: {
        changeUrl: (state, action) => {
            state.url = action.payload;
        },
        changeBasicAuthEnabled: (state, action) => {
            state.basicAuthEnabled = action.payload;
        },
        changeUsername: (state, action) => {
            state.username = action.payload;
        },
        changePassword: (state, action) => {
            state.password = action.payload;
        },
    },
});

export const {
    changeUrl,
    changeBasicAuthEnabled,
    changeUsername,
    changePassword,
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

export default settingsSlice.reducer;
