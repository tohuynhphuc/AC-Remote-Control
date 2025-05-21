import { getPeers, publish } from '$app/server';
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
		console.log(new Date().toISOString(), 'open', { username: peer.context.username });
		if (peer.context.username === 'arduino') {
			peer.subscribe('arduino');
			publish('phuc', 'arduino connected');
		} else {
			peer.subscribe('phuc');

			check_arudino_connected();
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

		check_arudino_connected();
	},
	error(peer, error) {
		console.error(new Date().toISOString(), 'error', { username: peer.context.username, error });
	}
};

function check_arudino_connected() {
	let arduino_connected = false;
	for (const peer of getPeers()) {
		if (peer.context.username === 'arduino' || peer.topics.has('arduino')) {
			arduino_connected = true;
		}
	}

	if (arduino_connected) publish('phuc', 'arduino reconnected');
	else publish('phuc', 'arduino disconnected');
}
