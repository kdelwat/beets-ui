import { createSlice } from "@reduxjs/toolkit";
import {
    deleteAlbums,
    deleteTracks,
    getAlbums,
    getTracks,
} from "../../api/api";

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
        nextQueryType: QueryType.QUERY_ALBUMS,
        queryState: { type: QueryState.LOADING },
        beetsQuery: "",
        results: [],
        resultSelected: null,
        filterString: null,
        deleteOnDisk: true,
    },
    reducers: {
        resultsLoaded: (state, action) => {
            state.results = action.payload;
            state.queryState = { type: QueryState.SUCCESS };
            state.queryType = state.nextQueryType;
        },
        resultsDeleted: (state, action) => {
            state.results = state.results.filter(
                (r) => !action.payload.includes(r.id)
            );
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
        changeNextQueryType: (state, action) => {
            state.nextQueryType = action.payload;
        },
        changeBeetsQuery: (state, action) => {
            state.beetsQuery = action.payload;
        },
        changeResultSelected: (state, action) => {
            state.resultSelected = action.payload;
        },
        changeDeleteOnDisk: (state, action) => {
            state.deleteOnDisk = action.payload;
        },
    },
});

export const {
    resultsLoaded,
    resultsDeleted,
    loadError,
    changeFilterString,
    changeNextQueryType,
    changeBeetsQuery,
    changeResultSelected,
    changeDeleteOnDisk,
} = querySlice.actions;

// Thunks

export const fetchResults = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();

            let results;
            if (state.query.nextQueryType === QueryType.QUERY_ALBUMS) {
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

export const deleteResults = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();

            const idsToDelete = state.query.results.map((r) => r.id);

            let result;
            if (state.query.nextQueryType === QueryType.QUERY_ALBUMS) {
                result = await deleteAlbums(
                    idsToDelete,
                    state.query.deleteOnDisk
                );
            } else {
                result = await deleteTracks(
                    idsToDelete,
                    state.query.deleteOnDisk
                );
            }

            if (result.deleted) {
                dispatch(resultsDeleted(idsToDelete));
            } else {
                dispatch(loadError("Could not delete results of query"));
            }
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
export const selectNextQueryType = (state) => state.query.nextQueryType;
export const selectBeetsQuery = (state) => state.query.beetsQuery;
export const selectResultSelected = (state) => state.query.resultSelected;
export const selectChosenResult = (state) =>
    state.query.results.find((r) => r.id === state.query.resultSelected);

export default querySlice.reducer;
