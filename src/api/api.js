export default class Api {
    constructor(state) {
        this.settings = state.global.settings.settings;
    }

    getAlbums = async (query) => {
        const url = isQuery(query) ? "/album/query/" + query : "/album";

        return await this.makeRequest(url).then((res) =>
            isQuery(query) ? res.results : res.albums
        );
    };

    deleteAlbums = async (ids) => {
        return await this.makeRequest(
            "/album/" + ids.map((id) => id.toString()).join(","),
            "DELETE"
        );
    };

    getTracks = async (query) => {
        const url = query && query !== "" ? "/item/query/" + query : "/item";

        return await this.makeRequest(url).then((res) =>
            isQuery(query) ? res.results : res.items
        );
    };

    deleteTracks = async (ids) => {
        return await this.makeRequest(
            "/item/" + ids.map((id) => id.toString()).join(","),
            "DELETE"
        );
    };

    getStats = async () => {
        return await this.makeRequest("/stats");
    };

    makeRequest = async (path, method) => {
        method = method || "GET";

        return fetch(this.settings.url + path, {
            method: method,
            headers: this.settings.basicAuth
                ? {
                      Authorization:
                          "Basic " +
                          btoa(
                              this.settings.basicAuth.username +
                                  ":" +
                                  this.settings.basicAuth.password
                          ),
                  }
                : {},
        }).then((res) => res.json());
    };
}

const isQuery = (query) => query && query !== "";
