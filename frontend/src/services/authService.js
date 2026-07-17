// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

export async function login(username, password) {
	return apiRequest('/api/auth/login', {method: 'POST', body: {
		username,
		password,
	}});
}

export async function setup2fa(username, password) {
	return apiRequest('/api/auth/2fa/setup', {method: 'POST', body: {
		username,
		password,
	}});
}

export async function verify2faSetup(
	username,
	password,
	otp,
) {
	return apiRequest('/api/auth/2fa/setup', {method: 'POST', body: {
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
	return apiRequest('/api/auth/2fa/login', {method: 'POST', body: {
		username,
		password,
        otp,
	}});
}
