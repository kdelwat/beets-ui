import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Alert, Table } from "evergreen-ui";
import {
    changeFilterString,
    fetchResults,
    QueryState,
    selectQueryState,
    selectResults,
} from "./querySlice";

// https://stackoverflow.com/a/58061735
const useFetching = (someFetchActionCreator) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(someFetchActionCreator());
    }, [dispatch, someFetchActionCreator]);
};

export function Query() {
    const results = useSelector(selectResults);
    const loadingState = useSelector(selectQueryState);
    const dispatch = useDispatch();

    useFetching(fetchResults);

    return loadingState.type === QueryState.ERROR ? (
        <Alert intent="danger" title={loadingState.error} />
    ) : (
        <Table>
            <Table.Head>
                <Table.SearchHeaderCell
                    onChange={(value) => dispatch(changeFilterString(value))}
                />
                <Table.TextHeaderCell>Artist</Table.TextHeaderCell>
                <Table.TextHeaderCell>Year</Table.TextHeaderCell>
            </Table.Head>

            <Table.Body>
                {results.map((album) => (
                    <Table.Row key={album.id}>
                        <Table.TextCell>{album.album}</Table.TextCell>
                        <Table.TextCell>{album.albumartist}</Table.TextCell>
                        <Table.TextCell isNumber>{album.year}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
