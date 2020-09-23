import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useEffect } from "react";
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    Heading,
    Pane,
    Paragraph,
    SearchInput,
    Select,
    Spinner,
    Table,
} from "evergreen-ui";
import {
    changeBeetsQuery,
    changeDeleteOnDisk,
    changeFilterString,
    changeNextQueryType,
    changeResultSelected,
    clearQuery,
    deleteResults,
    fetchResults,
    QueryState,
    QueryType,
    selectBeetsQuery,
    selectChosenResult,
    selectNextQueryType,
    selectQueryState,
    selectQueryType,
    selectResults,
} from "./querySlice";
import KeyVal from "../../components/KeyValue";

// https://stackoverflow.com/a/58061735
const useFetching = (someFetchActionCreator) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(someFetchActionCreator());
    }, [dispatch, someFetchActionCreator]);
};

export function Query() {
    const results = useSelector(selectResults);
    const queryState = useSelector(selectQueryState);
    const queryType = useSelector(selectQueryType);
    const nextQueryType = useSelector(selectNextQueryType);
    const beetsQuery = useSelector(selectBeetsQuery);
    const chosenResult = useSelector(selectChosenResult);
    const deleteOnDisk = useSelector((state) => state.query.deleteOnDisk);

    const dispatch = useDispatch();

    useFetching(fetchResults);

    return (
        <Pane>
            <Pane marginBottom={24}>
                <Select
                    value={nextQueryType}
                    onChange={(event) =>
                        dispatch(changeNextQueryType(event.target.value))
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
                <Button
                    onClick={() => dispatch(fetchResults())}
                    disabled={queryState.state === QueryState.LOADING}
                    isLoading={queryState.state === QueryState.LOADING}
                >
                    Run query
                </Button>
            </Pane>

            <hr />

            {queryState.state === QueryState.SUCCESS && (
                <Pane marginBottom={24} paddingBottom={16}>
                    <Alert
                        intent="success"
                        title={"Query returned " + results.length + " results."}
                    />

                    <Pane
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                    >
                        <Button
                            onClick={() => dispatch(deleteResults())}
                            marginRight={16}
                            intent={"danger"}
                        >
                            Remove all
                        </Button>

                        <Checkbox
                            label="Also delete files on disk"
                            checked={deleteOnDisk}
                            onChange={(e) =>
                                dispatch(changeDeleteOnDisk(e.target.checked))
                            }
                        />
                    </Pane>

                    <Pane
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                    >
                        <Button
                            onClick={() => dispatch(clearQuery())}
                            marginRight={16}
                        >
                            Clear query
                        </Button>
                    </Pane>
                </Pane>
            )}

            <QueryResult queryState={queryState} />

            <ResultDialog result={chosenResult} queryType={queryType} />
        </Pane>
    );
}

function QueryResult({ queryState }) {
    switch (queryState.state) {
        case QueryState.LOADING:
            return <Alert intent="none" title={"Running query..."} />;
        case QueryState.ERROR:
            return <Alert intent="danger" title={queryState.error} />;
        case QueryState.SUCCESS:
            return (
                <Table>
                    <TableHeader
                        labels={
                            queryState.resultType === QueryType.QUERY_ALBUMS
                                ? ["Artist", "Year"]
                                : ["Artist", "Album", "Year"]
                        }
                    />

                    <Table.Body>
                        {queryState.results.map((album) =>
                            queryState.resultType === QueryType.QUERY_ALBUMS ? (
                                <AlbumRow key={album.id} album={album} />
                            ) : (
                                <TrackRow key={album.id} track={album} />
                            )
                        )}
                    </Table.Body>
                </Table>
            );
        case QueryState.NOT_RUN:
        default:
            return (
                <Alert
                    intent="none"
                    title={"Enter a query above to see results"}
                />
            );
    }
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
    const dispatch = useDispatch();

    return (
        <Table.Row
            isSelectable
            onSelect={() => dispatch(changeResultSelected(album.id))}
        >
            <Table.TextCell>{album.album}</Table.TextCell>
            <Table.TextCell>{album.albumartist}</Table.TextCell>
            <Table.TextCell isNumber>{album.year}</Table.TextCell>
        </Table.Row>
    );
}

function TrackRow({ track }) {
    const dispatch = useDispatch();

    return (
        <Table.Row
            isSelectable
            onSelect={() => dispatch(changeResultSelected(track.id))}
        >
            <Table.TextCell>{track.title}</Table.TextCell>
            <Table.TextCell>{track.artist}</Table.TextCell>
            <Table.TextCell>{track.album}</Table.TextCell>
            <Table.TextCell isNumber>{track.year}</Table.TextCell>
        </Table.Row>
    );
}

function ResultDialog({ queryType, result }) {
    const dispatch = useDispatch();

    return (
        <Dialog
            isShown={!!result}
            title={queryType === QueryType.QUERY_ALBUMS ? "Album" : "Track"}
            onCloseComplete={() => dispatch(changeResultSelected(null))}
            confirmLabel="Done"
        >
            {!!result ? (
                queryType === QueryType.QUERY_ALBUMS ? (
                    <div>
                        <Heading size={600} marginBottom={8}>
                            {result.album} ({result.year})
                        </Heading>
                        <Heading size={500} marginBottom={16}>
                            {result.albumartist}
                        </Heading>
                        <KeyVal label="Genre" value={result.genre} />
                        <KeyVal label="Country" value={result.country} />
                        <KeyVal label="Label" value={result.label} />
                    </div>
                ) : (
                    <div>
                        <Heading size={600} marginBottom={8}>
                            {result.title} ({result.year})
                        </Heading>
                        <Heading size={500} marginBottom={16}>
                            {result.artist}, {result.album}
                        </Heading>

                        <KeyVal label="Genre" value={result.genre} />
                        <KeyVal label="Country" value={result.country} />
                        <KeyVal label="Label" value={result.label} />
                    </div>
                )
            ) : (
                <div />
            )}
        </Dialog>
    );
}
