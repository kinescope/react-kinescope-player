// Maps for number <-> hex string conversion
let _byteToHex: string[] = [];
let _hexToByte: {[key: string]: number} = {};
for (let i = 0; i < 256; i++) {
	_byteToHex[i] = (i + 0x100).toString(16).substr(1);
	_hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
export function parse(s: string, buf: number[] = [], offset: number = 0) {
	let i = (buf && offset) || 0;
	let ii = 0;

	buf = buf || [];
	s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {
		if (ii < 16) {
			// Don't overflow!
			buf[i + ii++] = _hexToByte[oct];
		}
		return '';
	});

	// Zero out remaining bytes if string was short
	while (ii < 16) {
		buf[i + ii++] = 0;
	}

	return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
export function unparse(buf: Uint8Array, offset: number = 0) {
	let i = offset || 0;
	let bth = _byteToHex;
	if (buf.length < 16) {
		return 'invalid token';
	}
	return (
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]] +
		'-' +
		bth[buf[i++]] +
		bth[buf[i++]] +
		'-' +
		bth[buf[i++]] +
		bth[buf[i++]] +
		'-' +
		bth[buf[i++]] +
		bth[buf[i++]] +
		'-' +
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]] +
		bth[buf[i++]]
	);
}
