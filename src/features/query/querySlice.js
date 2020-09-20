import { createSlice } from "@reduxjs/toolkit";
import { getAlbums, getTracks } from "../../api/api";

export const QueryType = {
    QUERY_ALBUMS: "QUERY_ALBUMS",
    QUERY_TRACKS: "QUERY_TRACKS",
};

export const QueryState = {
    LOADING: "LOADING",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
};

export const querySlice = createSlice({
    name: "query",
    initialState: {
        queryType: QueryType.QUERY_ALBUMS,
        queryState: { type: QueryState.LOADING },
        beetsQuery: "",
        results: [],
        filterString: null,
    },
    reducers: {
        resultsLoaded: (state, action) => {
            state.results = action.payload;
            state.queryState = { type: QueryState.SUCCESS };
        },
        loadError: (state, action) => {
            state.queryState = {
                type: QueryState.ERROR,
                error: action.payload,
            };
        },
        changeFilterString: (state, action) => {
            state.filterString = action.payload === "" ? null : action.payload;
        },
        changeQueryType: (state, action) => {
            state.queryType = action.payload;
            state.results = [];
        },
        changeBeetsQuery: (state, action) => {
            state.beetsQuery = action.payload;
        },
    },
});

export const {
    resultsLoaded,
    loadError,
    changeFilterString,
    changeQueryType,
    changeBeetsQuery,
} = querySlice.actions;

// Thunks

export const fetchResults = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();

            let results;
            if (state.query.queryType === QueryType.QUERY_ALBUMS) {
                results = await getAlbums(state.query.beetsQuery);
            } else {
                results = await getTracks(state.query.beetsQuery);
            }

            dispatch(resultsLoaded(results));
        } catch (err) {
            console.error(err);

            dispatch(loadError(err.message));
        }
    };
};

// Selectors
export const selectResults = (state) =>
    state.query.filterString
        ? state.query.results.filter(
              (a) =>
                  a.album
                      .toLowerCase()
                      .includes(state.query.filterString.toLowerCase()) ||
                  a.albumartist
                      .toLowerCase()
                      .includes(state.query.filterString.toLowerCase())
          )
        : state.query.results;

export const selectQueryState = (state) => state.query.queryState;
export const selectQueryType = (state) => state.query.queryType;
export const selectBeetsQuery = (state) => state.query.beetsQuery;

export default querySlice.reducer;
