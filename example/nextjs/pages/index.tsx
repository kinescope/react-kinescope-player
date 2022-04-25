import type {NextPage} from 'next';

import dynamic from 'next/dynamic';
const KinescopePlayer = dynamic(import('@kinescope/react-kinescope-player'), {ssr: false});

const Home: NextPage = () => {
	return <KinescopePlayer videoId="000000000" />;
};

export default Home;
