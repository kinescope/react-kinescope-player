<h1 align="center">React Kinescope Player</h1>

## Installation

Using npm:

```sh
npm install @kinescope-dev/react-kinescope-player --save
```

Using yarn:

```sh
yarn add @kinescope-dev/react-kinescope-player
```

## Getting Started

```jsx
// basic usage
import React from 'react'
import KinescopePlayer from '@kinescope-dev/react-kinescope-player';

function Player() {
  return (
    <KinescopePlayer videoId="00000000" />
  )
}

export default Player;
```

```jsx
// events
functions onTimeUpdate({currentTime}){
    ...
}

<KinescopePlayer videoId="00000000" onTimeUpdate={onTimeUpdate} />
```

```jsx
// methods

let playerRef = React.createRef();

<KinescopePlayer ref={playerRef} videoId="00000000" />

functions handleMuteClick(){
    playerRef.current.mute();
}

<button onClick={handleMuteClick}>Mute</button>
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
      <td>string</td>
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
      <td>style</td>
      <td>any</td>
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
</table>

##Events
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
      <td>onReady</td>
      <td>
        currentTime: number;<br/>
        duration: number;<br/>
        quality: number;
      </td>
  </tr>
  <tr>
      <td>onQualityChanged</td>
      <td>
        	quality: number;
      </td>
  </tr>
  <tr>
      <td>onAutoQualityChanged</td>
      <td>
        	quality: number;
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
      <td>playbackRate: boolean;</td>
  </tr>
  <tr>
      <td>onSeeking</td>
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
      <td>onError</td>
      <td>error: unknown;</td>
  </tr>
  <tr>
      <td>onDestroy</td>
      <td>No</td>
  </tr>
</table>

##Methods
| Method | Params | Result |
| --- | --- |
| isPaused | No | `Promise<boolean>` |
| isEnded | No | `Promise<boolean>` |
| play | No | `Promise<void>` |
| pause | No | `Promise<boolean>` |
| stop | No | `Promise<void>` |
| getCurrentTime | No | `Promise<number>` |
| getDuration | No | `Promise<number>` |
| seekTo | `(time: number)` | `Promise<void>` |
| isMuted | No | `Promise<boolean>` |
| mute | No | `Promise<void>` |
| unmute | No | `Promise<void>` |
| getVolume | No | `Promise<number>` |
| setVolume | `(value: number)` | `Promise<void>` |
| getPlaybackRate | No | `Promise<number>` |
| setPlaybackRate | `(value: number)` | `Promise<void>` |
| getVideoQualityList | No | `Promise<VideoQuality[]>` |
| getCurrentVideoQuality | No | `Promise<VideoQuality>` |
| setVideoQuality | `(quality: VideoQuality)` | `Promise<void>` |
| enableTextTrack | `(lang: string)` | `Promise<void>` |
| disableTextTrack | No | `Promise<void>` |
| isFullscreen | No | `Promise<boolean>` |
| setFullscreen | (fullscreen: boolean) | `Promise<void>` |
