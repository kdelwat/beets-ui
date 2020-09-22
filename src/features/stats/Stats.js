import { useDispatch, useSelector } from "react-redux";
import { fetchResults, selectResults } from "./statsSlice";
import React, { useEffect } from "react";
import { Paragraph } from "evergreen-ui";
import KeyVal from "../../components/KeyValue";

// https://stackoverflow.com/a/58061735
const useFetching = (someFetchActionCreator) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(someFetchActionCreator());
    }, [dispatch, someFetchActionCreator]);
};

export function Stats() {
    const results = useSelector(selectResults);

    useFetching(fetchResults);

    return !!results ? (
        <div>
            <KeyVal label={"Albums"} value={results.albums} />
            <KeyVal label={"Tracks"} value={results.items} />
        </div>
    ) : (
        <Paragraph>Loading stats...</Paragraph>
    );
}
