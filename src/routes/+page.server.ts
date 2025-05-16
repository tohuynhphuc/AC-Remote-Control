import { redirect } from '@sveltejs/kit';

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
