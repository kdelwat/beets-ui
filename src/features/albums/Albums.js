import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Alert, Table } from "evergreen-ui";
import {
    changeSearchQuery,
    fetchAlbums,
    selectAlbums,
    selectLoadingState,
} from "./albumsSlice";

// https://stackoverflow.com/a/58061735
const useFetching = (someFetchActionCreator) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(someFetchActionCreator());
    }, [dispatch, someFetchActionCreator]);
};

export function Albums() {
    const albums = useSelector(selectAlbums);
    const loadingState = useSelector(selectLoadingState);
    const dispatch = useDispatch();

    console.log(albums);

    useFetching(fetchAlbums);

    return loadingState.type === "error" ? (
        <Alert intent="danger" title={loadingState.error} />
    ) : (
        <Table>
            <Table.Head>
                <Table.SearchHeaderCell
                    onChange={(value) => dispatch(changeSearchQuery(value))}
                />
                <Table.TextHeaderCell>Artist</Table.TextHeaderCell>
                <Table.TextHeaderCell>Year</Table.TextHeaderCell>
            </Table.Head>

            <Table.Body>
                {albums.map((album) => (
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
