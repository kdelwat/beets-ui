import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Alert, Button, Pane, SearchInput, Select, Table } from "evergreen-ui";
import {
    changeBeetsQuery,
    changeFilterString,
    changeQueryType,
    fetchResults,
    QueryState,
    QueryType,
    selectBeetsQuery,
    selectQueryState,
    selectQueryType,
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
    const queryType = useSelector(selectQueryType);
    const beetsQuery = useSelector(selectBeetsQuery);
    const dispatch = useDispatch();

    useFetching(fetchResults);

    return (
        <Pane>
            <Select
                value={queryType}
                onChange={(event) =>
                    dispatch(changeQueryType(event.target.value))
                }
            >
                <option value="QUERY_ALBUMS" selected>
                    Albums
                </option>
                <option value="QUERY_TRACKS">Tracks</option>
            </Select>

            <SearchInput
                placeholder="Beets query..."
                value={beetsQuery}
                onChange={(event) =>
                    dispatch(changeBeetsQuery(event.target.value))
                }
            />

            <Button marginRight={16} onClick={() => dispatch(fetchResults())}>
                Run query
            </Button>

            {loadingState.type === QueryState.ERROR ? (
                <Alert intent="danger" title={loadingState.error} />
            ) : (
                <Table>
                    <TableHeader
                        labels={
                            queryType === QueryType.QUERY_ALBUMS
                                ? ["Artist", "Year"]
                                : ["Artist", "Album", "Year"]
                        }
                    />

                    <Table.Body>
                        {results.map((album) =>
                            queryType === QueryType.QUERY_ALBUMS ? (
                                <AlbumRow key={album.id} album={album} />
                            ) : (
                                <TrackRow key={album.id} track={album} />
                            )
                        )}
                    </Table.Body>
                </Table>
            )}
        </Pane>
    );
}

function TableHeader({ labels }) {
    const dispatch = useDispatch();

    return (
        <Table.Head>
            <Table.SearchHeaderCell
                onChange={(value) => dispatch(changeFilterString(value))}
            />
            {labels.map((l) => (
                <Table.TextHeaderCell key={l}>{l}</Table.TextHeaderCell>
            ))}
        </Table.Head>
    );
}

function AlbumRow({ album }) {
    return (
        <Table.Row>
            <Table.TextCell>{album.album}</Table.TextCell>
            <Table.TextCell>{album.albumartist}</Table.TextCell>
            <Table.TextCell isNumber>{album.year}</Table.TextCell>
        </Table.Row>
    );
}

function TrackRow({ track }) {
    return (
        <Table.Row>
            <Table.TextCell>{track.title}</Table.TextCell>
            <Table.TextCell>{track.artist}</Table.TextCell>
            <Table.TextCell>{track.album}</Table.TextCell>
            <Table.TextCell isNumber>{track.year}</Table.TextCell>
        </Table.Row>
    );
}
