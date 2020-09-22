const isQuery = (query) => query && query !== "";

export const getAlbums = async (query) => {
    const url = isQuery(query) ? "/album/query/" + query : "/album";

    return await fetch(makeURL(url))
        .then((res) => res.json())
        .then((res) => (isQuery(query) ? res.results : res.albums));
};

export const deleteAlbums = async (ids) => {
    return await fetch(
        makeURL("/album/" + ids.map((id) => id.toString()).join(",")),
        { method: "DELETE" }
    ).then((res) => res.json());
};

export const getTracks = async (query) => {
    const url = query && query !== "" ? "/item/query/" + query : "/item";

    return await fetch(makeURL(url))
        .then((res) => res.json())
        .then((res) => (isQuery(query) ? res.results : res.items));
};

export const deleteTracks = async (ids) => {
    return await fetch(
        makeURL("/item/" + ids.map((id) => id.toString()).join(",")),
        { method: "DELETE" }
    ).then((res) => res.json());
};

export const getStats = async () => {
    return await fetch(makeURL("/stats")).then((res) => res.json());
};

const makeURL = (selector) => {
    return "http://localhost:8337" + selector;
};
