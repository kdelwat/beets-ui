import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "../features/query/querySlice";
import statsReducer from "../features/stats/statsSlice";

export default configureStore({
    reducer: {
        query: queryReducer,
        stats: statsReducer,
    },
});
