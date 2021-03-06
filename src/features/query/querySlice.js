import { createSlice } from "@reduxjs/toolkit";
import Api from "../../api/api";

export const QueryType = {
    QUERY_ALBUMS: "QUERY_ALBUMS",
    QUERY_TRACKS: "QUERY_TRACKS",
};

export const QueryState = {
    NOT_RUN: "NOT_RUN",
    LOADING: "LOADING",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
};

export const querySlice = createSlice({
    name: "query",
    initialState: {
        queryState: {
            state: QueryState.LOADING,
            warnings: [],
            resultType: QueryType.QUERY_ALBUMS,
        },
        beetsQuery: "",
        nextQueryType: QueryType.QUERY_ALBUMS,
        resultSelected: null,
        filterString: null,
        deleteOnDisk: true,
    },
    reducers: {
        resultsLoaded: (state, action) => {
            state.queryState = {
                state: QueryState.SUCCESS,
                results: action.payload,
                resultType: state.nextQueryType,
            };
        },
        resultsDeleted: (state, action) => {
            state.queryState.results = state.queryState.results.filter(
                (r) => !action.payload.includes(r.id)
            );
        },
        clearQuery: (state) => {
            state.resultSelected = null;
            state.filterString = null;
            state.queryState = { state: QueryState.NOT_RUN };
        },
        loadError: (state, action) => {
            state.queryState = {
                state: QueryState.ERROR,
                error: action.payload,
            };
        },
        startLoading: (state, action) => {
            state.queryState = {
                state: QueryState.LOADING,
                warnings:
                    state.beetsQuery === ""
                        ? [
                              "This query may take a long time. Try making it more specific before searching.",
                          ]
                        : [],
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
    clearQuery,
    changeFilterString,
    changeNextQueryType,
    changeBeetsQuery,
    changeResultSelected,
    changeDeleteOnDisk,
    startLoading,
} = querySlice.actions;

// Thunks

export const fetchResults = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading());

            const state = getState();
            const api = new Api(state);

            let results;
            if (state.query.nextQueryType === QueryType.QUERY_ALBUMS) {
                results = await api.getAlbums(state.query.beetsQuery);
            } else {
                results = await api.getTracks(state.query.beetsQuery);
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
            const api = new Api(state);

            const idsToDelete = state.query.queryState.results.map((r) => r.id);

            let result;
            if (state.query.nextQueryType === QueryType.QUERY_ALBUMS) {
                result = await api.deleteAlbums(
                    idsToDelete,
                    state.query.deleteOnDisk
                );
            } else {
                result = await api.deleteTracks(
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
export const selectResults = (state) => {
    if (state.query.queryState.state !== QueryState.SUCCESS) {
        return null;
    }

    return state.query.filterString
        ? state.query.queryState.results.filter((r) =>
              applyFilterString(
                  r,
                  state.query.filterString.toLowerCase(),
                  state.query.queryState.resultType
              )
          )
        : state.query.queryState.results;
};

const applyFilterString = (result, filterString, resultType) => {
    switch (resultType) {
        case QueryType.QUERY_ALBUMS:
            return (
                result.album.toLowerCase().includes(filterString) ||
                result.albumartist.toLowerCase().includes(filterString)
            );
        case QueryType.QUERY_TRACKS:
        default:
            return (
                result.album.toLowerCase().includes(filterString) ||
                result.artist.toLowerCase().includes(filterString) ||
                result.title.toLowerCase().includes(filterString)
            );
    }
};
export const selectQueryState = (state) => state.query.queryState;
export const selectQueryType = (state) => state.query.queryState.resultType;
export const selectNextQueryType = (state) => state.query.nextQueryType;
export const selectBeetsQuery = (state) => state.query.beetsQuery;
export const selectChosenResult = (state) =>
    state.query.queryState.state === QueryState.SUCCESS
        ? state.query.queryState.results.find(
              (r) => r.id === state.query.resultSelected
          )
        : null;

export default querySlice.reducer;
