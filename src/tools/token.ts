import basex from 'base-x';
import {parse, unparse} from './uuid';
const ALPHABET = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const base58 = basex(ALPHABET);

export function isToken58(token: string) {
	return token[8] !== '-';
}

export function base58to64(token: string) {
	return unparse(base58.decode(token.replace(new RegExp('^0*'), '')));
}

export function base64to58(uuid: string) {
	return base58.encode(parse(uuid));
}

export function baseTo64(token: string) {
	if (isToken58(token)) {
		return base58to64(token);
	}
	return token;
}
