import { createSlice } from "@reduxjs/toolkit";
import { getAlbums } from "../../api/api";

export const albumsSlice = createSlice({
    name: "albums",
    initialState: {
        loadingState: { type: "loading" },
        albums: [],
        searchQuery: null,
    },
    reducers: {
        albumsLoaded: (state, action) => {
            state.albums = action.payload;
            state.loadingState = { type: "success" };
        },
        loadError: (state, action) => {
            state.loadingState = { type: "error", error: action.payload };
        },
        changeSearchQuery: (state, action) => {
            state.searchQuery = action.payload === "" ? null : action.payload;
        },
    },
});

export const {
    albumsLoaded,
    loadError,
    changeSearchQuery,
} = albumsSlice.actions;

// Thunks

export const fetchAlbums = () => {
    return async (dispatch, getState) => {
        try {
            const albums = await getAlbums();

            dispatch(albumsLoaded(albums));
        } catch (err) {
            console.error(err);
            // dispatch(albumsLoaded([]));

            dispatch(loadError(err.message));
        }
    };
};

// Selectors
export const selectAlbums = (state) =>
    state.albums.searchQuery
        ? state.albums.albums.filter(
              (a) =>
                  a.album
                      .toLowerCase()
                      .includes(state.albums.searchQuery.toLowerCase()) ||
                  a.albumartist
                      .toLowerCase()
                      .includes(state.albums.searchQuery.toLowerCase())
          )
        : state.albums.albums;

export const selectLoadingState = (state) => state.albums.loadingState;

export default albumsSlice.reducer;
