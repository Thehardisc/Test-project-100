import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { Playlist } from '../Playlist/Playlist';
import { SearchResults } from '../SearchResults/SearchResults';
import { spotify } from '../../util/spotify';
import './app.css';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playListName: "New Playlist",
            playListTracks:[]
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        let tracks = this.state.playListTracks;
        if (tracks.find(savedTracks => savedTracks.id === track.id)) {
            return;
        } else {
            tracks.push(track)
            this.setState({
              playListTracks: tracks,
            });
        }
    }
    search(term) {
        spotify.search(term).then(searchResults => {
            this.setState({
                searchResults: searchResults
            })
        });
    }
    removeTrack(track) {
        let tracks = this.state.playListTracks;
        tracks = tracks.filter(currtrack => currtrack.id !== track.id);

        this.setState({
            playListTracks: tracks
        })
    }
    savePlaylist() {
        const trackUris = this.state.playListTracks.map(track => track.uri);
        spotify.savePlayList(this.state.playListName, trackUris).then(() => {
            this.setState( {
                playListName: 'New Playlist',
                playListTracks: []
            })
        })  
    }

    updatePlaylistName(track) {
        this.setState({
            playListName: track
        })
    }
    render() {
        return(
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                <SearchBar onSearch={this.search}/>
                <div className="App-playlist">
                    <SearchResults 
                        SearchResults={this.state.searchResults} 
                        onAdd={this.addTrack} />
                    <Playlist 
                        playListName={this.state.playListName} 
                        playListTracks={this.state.playListTracks} 
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist} />
                </div>
                </div>
            </div>
        )
    }
}