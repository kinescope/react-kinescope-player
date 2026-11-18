import {afterEach, beforeEach, expect} from 'vitest';
import {cleanup} from '@testing-library/react';
import {resetIframeApiLoader} from '../src/tools/script';

const unhandled: unknown[] = [];
process.on('unhandledRejection', reason => {
	unhandled.push(reason);
});

beforeEach(() => {
	unhandled.length = 0;
});

afterEach(async () => {
	cleanup();
	/* let pending rejections surface */
	await new Promise(resolve => setTimeout(resolve, 0));
	await new Promise(resolve => setTimeout(resolve, 0));
	const errors = unhandled.splice(0);
	delete (window as any).Kinescope;
	document.querySelectorAll('script').forEach(s => s.remove());
	resetIframeApiLoader();
	expect(errors, 'unhandled rejections').toEqual([]);
});
