<!-- src\views\LoginView.vue -->
<template>
	<div class="login-container">
		<!-- Вход -->
		<form
			v-if="authStep === 'login'"
			class="login-box"
			@submit.prevent="handleLogin"
		>
			<h2>Вход</h2>

			<label for="username">Логин</label>
			<input
				id="username"
				v-model="username"
				type="text"
				name="username"
				placeholder="Ваш логин"
				required
				autofocus
			>

			<label for="password">Пароль</label>
			<input
				id="password"
				v-model="password"
				type="password"
				name="password"
				placeholder="Ваш пароль"
				required
			>

			<button type="submit">
				Войти
			</button>
		</form>

		<!-- Настройка 2FA -->
		<div
			v-if="authStep === '2fa-setup'"
			class="login-box"
		>
			<h2>Настройка 2FA</h2>

			<div
				ref="qrCodeContainer"
				class="qr-code"
			/>

			<form @submit.prevent="confirm2faSetupHandler">
				<label for="otp_setup">
					Код из приложения
				</label>

				<input
					id="otp_setup"
					v-model="setupOtp"
					type="text"
					name="otp"
					placeholder="6-значный код"
					required
					autocomplete="off"
				>

				<button type="submit">
					Подтвердить
				</button>
			</form>
		</div>

		<!-- Подтверждение входа -->
		<div
			v-if="authStep === '2fa-confirm'"
			class="login-box"
		>
			<h2>Подтверждение входа</h2>

			<form @submit.prevent="confirm2faLoginHandler">
				<label for="otp_confirm">
					Код из приложения
				</label>

				<input
					id="otp_confirm"
					v-model="confirmOtp"
					type="text"
					name="otp"
					placeholder="6-значный код"
					required
					autocomplete="off"
				>

				<button type="submit">
					Подтвердить
				</button>
			</form>
		</div>

		<!-- Попап -->
		<div
			v-if="popupMessage"
			class="popup-message"
			:class="{ error: popupType === 'error' }"
		>
			<span>{{ popupMessage }}</span>

			<button
				type="button"
				@click="closePopup"
			>
				✕
			</button>
		</div>
	</div>
</template>


<script setup>

import { ref } from 'vue';
import QRCode from 'qrcode';

import {
	login,
	setup2fa,
	verify2faSetup,
	verify2faLogin,
} from '@/services/authService';

const username = ref('');
const password = ref('');

const setupOtp = ref('');
const confirmOtp = ref('');

const qrCodeContainer = ref(null);

/**
 * @type {import('vue').Ref<'login' | '2fa-setup' | '2fa-confirm'>}
 */
const authStep = ref('login');

const popupMessage = ref('');
const popupType = ref('info');

let popupTimeout = null;

async function handleLogin() {
	try {
		const data = await login(
			username.value.trim(),
			password.value.trim(),
		);

		if (data.setup_required) {
			await start2faSetup();
			return;
		}

		if (data.two_factor_required) {
			authStep.value = '2fa-confirm';
			return;
		}

		navigateToHome();
	} catch (error) {
		showErrorPopup(
			error?.message || 'Ошибка авторизации',
		);
	}
}

async function start2faSetup() {
	try {
		const data = await setup2fa(
			username.value,
			password.value,
		);

		authStep.value = '2fa-setup';

		const canvas = document.createElement('canvas');

		await QRCode.toCanvas(
			canvas,
			data.otpauth_url,
			{
				width: 256,
			},
		);

		qrCodeContainer.value?.replaceChildren(canvas);
	} catch (error) {
		showErrorPopup(
			error?.message || 'Ошибка настройки 2FA',
		);
	}
}

async function confirm2faSetupHandler() {
	try {
		await verify2faSetup(
			username.value,
			password.value,
			setupOtp.value.trim(),
		);

		setupOtp.value = '';

		authStep.value = 'login';

		showPopup('Настройка завершена');
	} catch (error) {
		showErrorPopup(
			error?.message || 'Неверный код',
		);
	}
}

async function confirm2faLoginHandler() {
	try {
		await verify2faLogin(
			username.value,
			password.value,
			confirmOtp.value.trim(),
		);

		confirmOtp.value = '';

		navigateToHome();
	} catch (error) {
		showErrorPopup(
			error?.message || 'Ошибка авторизации',
		);
	}
}

function navigateToHome() {
	window.location.href = '/';
}

function showPopup(message, type = 'info') {
	clearTimeout(popupTimeout);

	popupMessage.value = message;
	popupType.value = type;

	popupTimeout = setTimeout(() => {
		closePopup();
	}, 5000);
}

function showErrorPopup(message) {
	showPopup(message, 'error');
}

function closePopup() {
	clearTimeout(popupTimeout);

	popupMessage.value = '';
	popupType.value = 'info';
}

</script>


<style scoped>
.login-container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	min-width: 100vw;
	min-height: 100vh;

	background-color: #f5f5f5;
}

.login-box {
	display: flex;
	flex-direction: column;
	gap: 8px;

	min-width: 360px;

	padding: 40px;

	background-color: white;

	border-radius: 8px;

	box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
}

.qr-code {
	display: flex;
	justify-content: center;

	margin-bottom: 16px;
}

input {
	width: 100%;

	padding: 12px;

	border: 1px solid #ddd;
	border-radius: 4px;

	font-size: 16px;

	box-sizing: border-box;
}

button {
	padding: 12px 24px;

	border: none;
	border-radius: 4px;

	cursor: pointer;

	font-size: 16px;

	background-color: #007bff;
	color: white;
}

button:hover {
	background-color: #0056b3;
}

.popup-message {
	position: fixed;
	top: 20px;
	right: 20px;

	display: flex;
	align-items: center;
	gap: 12px;

	max-width: 400px;

	padding: 16px;

	border-radius: 8px;

	color: white;

	box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.popup-message.error {
	background-color: #dc3545;
}

.popup-message:not(.error) {
	background-color: #17a2b8;
}
</style>