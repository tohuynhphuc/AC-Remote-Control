import { fail, redirect } from '@sveltejs/kit';

import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	return {
		id: event.locals.user.id,
		username: event.locals.user.username,
		session_token: event.cookies.get('session')
	};
};

export const actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		invalidateSession(event.locals.session.id);

		deleteSessionTokenCookie(event);

		redirect(302, '/login');
	}
};
