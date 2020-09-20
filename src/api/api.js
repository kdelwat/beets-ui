const isQuery = (query) => query && query !== "";

export const getAlbums = async (query) => {
    const url = isQuery(query) ? "/album/query/" + query : "/album";

    return await fetch(makeURL(url))
        .then((res) => res.json())
        .then((res) => (isQuery(query) ? res.results : res.albums));
};

export const getTracks = async (query) => {
    const url = query && query !== "" ? "/item/query/" + query : "/item";

    return await fetch(makeURL(url))
        .then((res) => res.json())
        .then((res) => (isQuery(query) ? res.results : res.items));
};

const makeURL = (selector) => {
    return "http://localhost:8337" + selector;
};
