const clientId = '302e5d24f660492f965f04101f6e36e4';
const redictURI = 'http://localhost:3000/'
let auth;
export const spotify = {
    getAccessToken() {
        if (auth) {
            return auth;
        }

        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expireInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expireInMatch) {
            auth = accessToken[1];
            const expiresIn = Number(expireInMatch[1]);

            window.setTimeout(() => auth = '', expiresIn * 1000);
            window.history.pushState('Access Token', null , '/');
            return auth;
        } else {
            const accessURI = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redictURI}`
            window.location = accessURI;
        }
    },

    search(term) {
        const accessToken = spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
             headers: { 
                Authorization: `Bearer ${accessToken}`
                }}).then(response => {
                    return response.json()
                }).then(jsonResponse => {
                    if(!jsonResponse.tracks) {
                        return [];
                    }
                    return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                    }));

                     });
    },
    savePlayList(name, trackUlis) {
        if (!name || !trackUlis.length) {
            return;
        }

        const accessToken = spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json())
            .then(jsonResponse => {
                const playListId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify( {uris: trackUlis})
                })
            })
        })
    }
}