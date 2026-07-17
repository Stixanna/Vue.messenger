// src/services/authService.js

const API_URL = 'http://localhost:8000';

async function request(url, body) {
	const response = await fetch(`${API_URL}${url}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	let data = null;

	try {
		data = await response.json();
	} catch {
		// Пустой ответ сервера
	}

	if (!response.ok) {
		throw new Error(
			data?.detail ||
			data?.message ||
			'Ошибка запроса'
		);
	}

	return data;
}

export async function login(username, password) {
	return request('/api/auth/login', {
		username,
		password,
	});
}

export async function setup2fa(username, password) {
	return request('/api/auth/2fa/setup', {
		username,
		password,
	});
}

export async function verify2faSetup(
	username,
	password,
	otp,
) {
	return request('/api/auth/2fa/setup', {
		username,
		password,
		otp,
	});
}

export async function verify2faLogin(
	username,
	password,
	otp,
) {
	return request('/api/auth/2fa/login', {
		username,
		password,
		otp,
	});
}