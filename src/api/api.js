export const getAlbums = async () => {
    return await fetch(makeURL("/album"))
        .then((res) => res.json())
        .then((res) => res.albums);
};

export const getTracks = async () => {
    return await fetch(makeURL("/item"))
        .then((res) => res.json())
        .then((res) => res.items);
};

const makeURL = (selector) => {
    return "http://localhost:8337" + selector;
};
