import React, {RefObject} from 'react'
import KinescopePlayer, {PlayerPropsTypes} from '@kinescope/react-kinescope-player';
export {KinescopePlayer};

type Props = PlayerPropsTypes & {
    forwardRef?: RefObject<KinescopePlayer>
}

const isServer = () => typeof window === `undefined`;

export default function Player({ forwardRef, ...props }: Props) {
    if(isServer()) {
        return null;
    }
    return <KinescopePlayer {...props} ref={forwardRef}  />;
}
