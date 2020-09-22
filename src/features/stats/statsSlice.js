import { createSlice } from "@reduxjs/toolkit";
import Api from "../../api/api";

export const statsSlice = createSlice({
    name: "stats",
    initialState: { results: null },
    reducers: {
        resultsLoaded: (state, action) => {
            state.results = action.payload;
        },
    },
});

export const { resultsLoaded } = statsSlice.actions;

export const fetchResults = () => {
    return async (dispatch, getState) => {
        try {
            const results = await new Api(getState()).getStats();

            dispatch(resultsLoaded(results));
        } catch (err) {
            console.error(err);
        }
    };
};

export const selectResults = (state) => state.stats.results;

export default statsSlice.reducer;
