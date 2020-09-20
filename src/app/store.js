import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import albumsReducer from "../features/albums/albumsSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    albums: albumsReducer
  },
});
