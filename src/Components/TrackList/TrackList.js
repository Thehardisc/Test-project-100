import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
    render() {
        let table = this.props.tracker;
        let track2 = table.map(track => { return <Track tracks={track} key={track.id} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} onRemove={this.props.onRemove}/> });
        return (
            <div className="TrackList">
                {track2}
            </div>
        )
    }
}