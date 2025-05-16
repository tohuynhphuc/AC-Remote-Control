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
		peer.websocket.binaryType = 'arraybuffer';
		if (peer.context.username === 'arduino') peer.subscribe('arduino');
	},
	message(peer, message) {
		try {
			publish('arduino', message.data);
		} catch (e) {
			peer.send(e);
			console.log(e);
		}
	},
	close(peer, details) {
		console.log('close', peer.context.username, details);
	},
	error(peer, error) {
		console.error('error', error);
	}
};
