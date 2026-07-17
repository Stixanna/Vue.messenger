// src/services/authService.js

const API_URL = 'http://localhost:8000';

async function request(url, options = {}) {
	const response = await fetch(`${API_URL}${url}`, {
		...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        method: options.method ?? 'GET',
        body: options.body ? JSON.stringify(options.body) : {},
    });

	let data = null;

	try {
		data = await response.json();
	} catch {
		// Пустой ответ сервера
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

export async function login(username, password) {
	return request('/api/auth/login', {method: 'POST', body: {
		username,
		password,
	}});
}

export async function setup2fa(username, password) {
	return request('/api/auth/2fa/setup', {method: 'POST', body: {
		username,
		password,
	}});
}

export async function verify2faSetup(
	username,
	password,
	otp,
) {
	return request('/api/auth/2fa/setup', {method: 'POST', body: {
		username,
		password,
        otp,
	}});
}

export async function verify2faLogin(
	username,
	password,
	otp,
) {
	return request('/api/auth/2fa/login', {method: 'POST', body: {
		username,
		password,
        otp,
	}});
}
