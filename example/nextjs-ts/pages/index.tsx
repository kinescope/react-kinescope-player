import type {NextPage} from 'next'
import dynamic from 'next/dynamic'
import {Fragment, useRef} from "react";
import type {KinescopePlayer} from './player';

const Player = dynamic(() => import("./player"), {
  ssr: false,
});

const Home: NextPage = () => {
  const playerRef = useRef<KinescopePlayer>(null);

  function seekTo() {
    playerRef.current && playerRef.current.seekTo(0)
  }

  return (
      <Fragment>
        <Player forwardRef={playerRef} videoId="000000"/>
        <button onClick={seekTo}>seek</button>
      </Fragment>
  )
}

export default Home
