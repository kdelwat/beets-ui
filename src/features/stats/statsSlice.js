import { createSlice } from "@reduxjs/toolkit";
import { getStats } from "../../api/api";

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
    return async (dispatch) => {
        try {
            const results = await getStats();

            dispatch(resultsLoaded(results));
        } catch (err) {
            console.error(err);
        }
    };
};

export const selectResults = (state) => state.stats.results;

export default statsSlice.reducer;
