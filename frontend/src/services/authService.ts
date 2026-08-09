// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

export async function login(
	  username: string,
	  password: string,
	): Promise<any> {
	const response = await apiRequest('/auth/login', {method: 'POST', body: {
		username,
		password,
	}});
	return response;
}

export async function setup2fa(
	  username: string,
	  password: string,
	): Promise<any> {
	return apiRequest('/auth/2fa/setup', {method: 'POST', body: {
		username,
		password,
	}});
}

export async function verify2faSetup(
	  username: string,
	  password: string,
	  otp: string,
	): Promise<any> {
	return apiRequest('/auth/2fa/setup', {method: 'POST', body: {
		username,
		password,
        otp,
	}});
}

export async function verify2faLogin(
	  username: string,
	  password: string,
	  otp: string,
	): Promise<any> {
	return apiRequest('/auth/2fa/login', {method: 'POST', body: {
		username,
		password,
        otp,
	}});
}
