import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "../features/query/querySlice";

export default configureStore({
    reducer: {
        query: queryReducer,
    },
});
