export const getAlbums = async () => {
    return await fetch(makeURL("/album"))
        .then((res) => res.json())
        .then((res) => res.albums);
};

const makeURL = (selector) => {
    return "http://localhost:8337" + selector;
};
