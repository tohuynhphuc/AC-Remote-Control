import { publish } from '$app/server';
import { validateSessionToken } from '$lib/server/session';
import { error } from '@sveltejs/kit';
import type { Socket } from './$types';

let ardunino_conencted = false;

export const socket: Socket = {
	upgrade(event) {
		const session_token = event.cookies.get('session');
		if (!session_token) error(401, 'Unauthorized');
		const { user } = validateSessionToken(session_token);
		if (!user) error(401, 'Unauthorized');
		event.context.username = user.username;
	},
	open(peer) {
		console.log(new Date().toISOString(), 'open', { username: peer.context.username });
		if (peer.context.username === 'arduino') {
			peer.subscribe('arduino');
			ardunino_conencted = true;
			publish('phuc', 'arduino connected');
		} else {
			peer.subscribe('phuc');
			if (ardunino_conencted) publish('phuc', 'arduino reconnected');
			else publish('phuc', 'arduino disconnected');
		}
	},
	message(peer, message) {
		try {
			let data;

			if (Buffer.isBuffer(message.data)) {
				data = message.data.toString();
			}

			if (typeof data === 'string') {
				data = message.data;
			}

			console.log(new Date().toISOString(), 'message', {
				username: peer.context.username,
				data,
				raw: message.data
			});

			if (data && peer.context.username !== 'arduino') {
				publish('arduino', data);
			}
		} catch (e) {
			console.log(e);
		}
	},
	close(peer, details) {
		console.log(new Date().toISOString(), 'close', { username: peer.context.username, details });
		if (peer.context.username === 'arduino') {
			ardunino_conencted = false;
			publish('phuc', 'arduino disconnected');
		}
	},
	error(peer, error) {
		console.error(new Date().toISOString(), 'error', { username: peer.context.username, error });
	}
};
