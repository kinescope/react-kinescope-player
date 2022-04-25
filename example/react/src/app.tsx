import React from 'react';
import {render} from 'react-dom';
import Player from '@kinescope/react-kinescope-player';

function App() {
	return <Player videoId="000000000" />;
}

render(<App />, document.getElementById('app'));
