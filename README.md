[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://kinescope.io/)

<h1 align="center">React Kinescope Player</h1>

## Installation

Using npm:

```sh
npm install @kinescope/react-kinescope-player --save
```

Using yarn:

```sh
yarn add @kinescope/react-kinescope-player
```

## Getting Started

### Basic usage
```jsx
import React from 'react'
import KinescopePlayer from '@kinescope/react-kinescope-player';

function Player() {
  return (
    <KinescopePlayer videoId="00000000" />
  )
}

export default Player;
```

### Events
```jsx
functions onTimeUpdate({currentTime}){
    ...
}

<KinescopePlayer videoId="00000000" onTimeUpdate={onTimeUpdate} />
```

### Methods
```jsx
let playerRef = React.createRef();

<KinescopePlayer ref={playerRef} videoId="00000000" />

functions handleMuteClick(){
    playerRef.current.mute();
}

<button onClick={handleMuteClick}>Mute</button>
```

### Next.js
```jsx
import dynamic from 'next/dynamic'
const KinescopePlayer = dynamic(import('@kinescope/react-kinescope-player'), { ssr: false });

function Player() {
	return (
		<KinescopePlayer videoId="00000000" />
	)
}

export default Player;
```

## Props
<table>
  <tr>
    <th>Prop</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
      <td>videoId</td>
      <td>string | string[]</td>
      <td>No</td>
      <td>Yes</td>
  </tr>
  <tr>
      <td>className</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr>  
  <tr>
      <td>query</td>
      <td><a href="#query">Query</a></td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>style</td>
      <td>any</td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>preload</td>
      <td>boolean | 'none' | 'metadata' | 'auto'</td>
      <td>false</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>title</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>subtitle</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>poster</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>chapters</td>
      <td><a href="#chapter">Chapter</a>[]</td>
      <td>No</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>vtt</td>
      <td><a href="#vtt">Vtt</a>[]</td>
      <td>No</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>width</td>
      <td>number | string</td>
      <td>100%</td>
      <td>No</td>
  </tr>
  <tr>
      <td>height</td>
      <td>number | string</td>
      <td>100%</td>
      <td>No</td>
  </tr>
  <tr>
      <td>autoPlay</td>
      <td>boolean | 'viewable'</td>
      <td>false</td>
      <td>No</td>
  </tr>
  <tr>
      <td>autoPause</td>
      <td>boolean | 'reset'</td>
      <td>true</td>
      <td>No</td>
  </tr>
  <tr>
      <td>loop</td>
      <td>boolean</td>
      <td>false</td>
      <td>No</td>
  </tr>
  <tr>
      <td>playsInline</td>
      <td>boolean</td>
      <td>true</td>
      <td>No</td>
  </tr>
  <tr>
      <td>muted</td>
      <td>boolean</td>
      <td>false</td>
      <td>No</td>
  </tr>
  <tr>
      <td>language</td>
      <td>'en' | 'ru'</td>
      <td>auto</td>
      <td>No</td>
  </tr>  
  <tr>
      <td>controls</td>
      <td>boolean</td>
      <td>true</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>mainPlayButton</td>
      <td>boolean</td>
      <td>true</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>playbackRateButton</td>
      <td>boolean</td>
      <td>false</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>textTrack</td>
      <td>boolean | string</td>
      <td>true</td>
      <td>No</td>
  </tr> 
  <tr>
      <td>externalId</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>drmAuthToken</td>
      <td>string</td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>callToAction</td>
      <td><a href="#callToAction">CallToAction</a>[]</td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>bookmarks</td>
      <td><a href="#bookmark">Bookmark</a>[]</td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>watermark</td>
      <td><a href="#watermark">Watermark</a></td>
      <td>No</td>
      <td>No</td>
  </tr>
  <tr>
      <td>playlistOptions</td>
      <td><a href="#PlaylistOptions">PlaylistOptions</a></td>
      <td>No</td>
      <td>No</td>
  </tr>   
  <tr>
      <td>theme</td>
      <td><a href="#theme">Theme</a></td>
      <td>No</td>
      <td>No</td>
  </tr>  
  <tr>
      <td>localStorage</td>
      <td><a href="#localStorage">LocalStorage</a></td>
      <td>true</td>
      <td>No</td>
  </tr>
</table>

##### Chapter
```ts
type Chapter = {
	position: number;
	title: string;
};
```

##### Query
```ts
type QueryTypes = {
    seek?: number;
    duration?: number;
    playerId?: string;
};
```

##### LocalStorage
```ts
type LocalStorage = boolean | {
	quality?: 'item' | 'global' | boolean;
	time?: boolean;
	textTrack?: 'item' | 'global' | boolean;
};
```

##### vtt
```ts
type Vtt = {
	label: string;
	src: string;
	srcLang: string;
};
```

##### CallToAction
```ts
type CallToAction = {
	id: string;
	title: string;
	description?: string;
	skipable?: boolean;
	buttonStyle?: object;
	trigger: {
		percentages: number[];
		timePoints: number[];
		pause: boolean;
	};
};
```

##### Bookmark
```ts
type Bookmark = {
	id: string;
	time: number;
	title?: string;
};
```

##### Watermark
```ts
type Watermark =
	| string
	| {
	text: string;
	mode?: WatermarkModeTypes;
	scale?: number;
	displayTimeout?: number | { visible: number; hidden: number };
};
```

##### PlaylistOptions
```ts
type PlaylistOptions = {
	autoSwitch?: boolean;
	initialItem?: string;
	loop?: boolean;
};
```

##### Theme
```ts
type Theme = {
	subtitles?: {
		/** Base font size in em. */
		textSсale: number;
		textAlign: 'left' | 'center';
		textLength: 'auto' | number;
	};
};
```

## Events
<table>
  <tr>
    <th>Event</th>
    <th>Data</th>
  </tr>
  <tr>
      <td>onJSLoad</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onJSLoadError</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onInit</td>
      <td>
        playerId: string;
      </td>
  </tr>
  <tr>
      <td>onInitError</td>
      <td>Error</td>
  </tr>
  <tr>
      <td>onReady</td>
      <td>
        currentTime: number;<br/>
        duration: number;<br/>
        quality: VideoQuality;
      </td>
  </tr>
  <tr>
      <td>onQualityChanged</td>
      <td>
        	quality: VideoQuality;
      </td>
  </tr>
  <tr>
      <td>onCurrentTrackChanged</td>
      <td>
        	item: {id?: string};
      </td>
  </tr>
  <tr>
      <td>onSeekChapter</td>
      <td>
        	position: number;
      </td>
  </tr>
  <tr>
      <td>onSizeChanged</td>
      <td>
            width: number;<br/>
            height: number;
      </td>
  </tr>
  <tr>
      <td>onPlay</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onPlaying</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onWaiting</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onPause</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onEnded</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onTimeUpdate</td>
      <td>currentTime: number;</td>
  </tr>
  <tr>
      <td>onProgress</td>
      <td>bufferedTime: number;</td>
  </tr>
  <tr>
      <td>onDurationChange</td>
      <td>duration: number;</td>
  </tr>
  <tr>
      <td>onVolumeChange</td>
      <td>
        muted: boolean;<br/>
        volume: number;
      </td>
  </tr>
  <tr>
      <td>onPlaybackRateChange</td>
      <td>playbackRate: number;</td>
  </tr>
  <tr>
      <td>onSeeked</td>
      <td>No</td>
  </tr>
  <tr>
      <td>onFullscreenChange</td>
      <td>
        isFullscreen: boolean;<br/>
        video: boolean;
      </td>
  </tr>  
  <tr>
      <td>onPipChange</td>
      <td>
        isPip: boolean;
      </td>
  </tr>
  <tr>
      <td>onCallAction</td>
      <td>
        id: string;
        title?: string;
        type: string;
      </td>
  </tr>
  <tr>
      <td>onCallBookmark</td>
      <td>
        id: string;<br/>
        time: number;<br/>
        title?: string;
      </td>
  </tr>
  <tr>
      <td>onError</td>
      <td>error: unknown;</td>
  </tr>
  <tr>
      <td>onDestroy</td>
      <td>No</td>
  </tr>
</table>

## Methods
<table>
  <tr>
    <th>Method</th>
    <th>Params</th>
    <th>Result</th>
  </tr>
  <tr>
      <td>isPaused</td>
      <td>No</td>
      <td>Promise&lt;boolean&gt;</td>
  </tr>
  <tr>
      <td>isEnded</td>
      <td>No</td>
      <td>Promise&lt;boolean&gt;</td>
  </tr>
  <tr>
      <td>play</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>pause</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>stop</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>getCurrentTime</td>
      <td>No</td>
      <td>Promise&lt;number&gt;</td>
  </tr>
  <tr>
      <td>getDuration</td>
      <td>No</td>
      <td>Promise&lt;number&gt;</td>
  </tr>
  <tr>
      <td>seekTo</td>
      <td>(time: number)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>isMuted</td>
      <td>No</td>
      <td>Promise&lt;boolean&gt;</td>
  </tr>
  <tr>
      <td>mute</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>unmute</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>getVolume</td>
      <td>No</td>
      <td>Promise&lt;number&gt;</td>
  </tr>
  <tr>
      <td>setVolume</td>
      <td>(value: number)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>getPlaybackRate</td>
      <td>No</td>
      <td>Promise&lt;number&gt;</td>
  </tr>
  <tr>
      <td>setPlaybackRate</td>
      <td>(value: number)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>getVideoQualityList</td>
      <td>No</td>
      <td>Promise&lt;VideoQuality[]&gt;</td>
  </tr>
  <tr>
      <td>getVideoQuality</td>
      <td>No</td>
      <td>Promise&lt;VideoQuality&gt;</td>
  </tr>
  <tr>
      <td>setVideoQuality</td>
      <td>(quality: VideoQuality)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>enableTextTrack</td>
      <td>(lang: string)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>disableTextTrack</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>closeCTA</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>isFullscreen</td>
      <td>No</td>
      <td>Promise&lt;boolean&gt;</td>
  </tr>
  <tr>
      <td>setFullscreen</td>
      <td>(fullscreen: boolean)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>isPip</td>
      <td>No</td>
      <td>Promise&lt;boolean&gt;</td>
  </tr>
  <tr>
      <td>setPip</td>
      <td>(pip: boolean)</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>getPlaylistItem</td>
      <td>No</td>
      <td>Promise<{id: string | undefined} | undefined></td>
  </tr>
  <tr>
      <td>switchTo</td>
      <td>(id: string)</td>
       <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>next</td>
       <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
  <tr>
      <td>previous</td>
      <td>No</td>
      <td>Promise&lt;void&gt;</td>
  </tr>
</table>
