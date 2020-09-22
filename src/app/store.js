import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "../features/query/querySlice";
import statsReducer from "../features/stats/statsSlice";
import globalReducer from "../features/global/globalSlice";
import settingsReducer from "../features/settings/settingsSlice";

export default configureStore({
    reducer: {
        query: queryReducer,
        stats: statsReducer,
        settings: settingsReducer,
        global: globalReducer,
    },
});
