
import { BASE_URL } from '@/config';


export async function apiRequest(url, options = {}) {
	let response;

	try {
		response = await fetch(`${BASE_URL}${url}`, {
			credentials: 'include',

			method: options.method ?? 'GET',

			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},

			body: options.body
				? JSON.stringify(options.body)
				: undefined,
		});
	} catch {
		throw new Error('Сервер недоступен');
	}

	let data = null;

	try {
		data = await response.json();
	} catch {
		// ответ без json
	}

	if (!response.ok) {
		throw new Error(
			data?.detail[0].msg ||
			data?.detail ||
			'Ошибка запроса'
		);
	}

	return data;
}