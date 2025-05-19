import { publish } from '$app/server';
import { validateSessionToken } from '$lib/server/session';
import { error } from '@sveltejs/kit';
import type { Socket } from './$types';

export const socket: Socket = {
	upgrade(event) {
		const session_token = event.cookies.get('session');
		if (!session_token) error(401, 'Unauthorized');
		const { user } = validateSessionToken(session_token);
		if (!user) error(401, 'Unauthorized');
		event.context.username = user.username;
	},
	open(peer) {
		console.log(Date.now(), 'open', { username: peer.context.username });
		if (peer.context.username === 'arduino') peer.subscribe('arduino');
	},
	message(peer, message) {
		try {
			const data = (message.data as Buffer).toString();
			console.log(Date.now(), 'message', { username: peer.context.username, data });
			publish('arduino', data);
		} catch (e) {
			console.log(e);
		}
	},
	close(peer, details) {
		console.log(Date.now(), 'close', { username: peer.context.username, details });
	},
	error(peer, error) {
		console.error(Date.now(), 'error', { username: peer.context.username, error });
	}
};
