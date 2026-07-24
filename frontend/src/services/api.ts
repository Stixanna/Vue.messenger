
import { BASE_URL } from '@/config';


export async function apiRequest(
  url: string,
  options: {
    method?: string,
    headers?: any,
    body?: any
  },
): Promise<any> {
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

  const contentType = response.headers.get('content-type') ?? '';

  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else if (contentType.startsWith('text/')) {
    data = await response.text();
  } else {
    // Любой другой Content-Type считаем бинарными данными
    data = await response.blob();
  }

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
      data?.detail ||
      (typeof data === 'string' ? data : 'Ошибка запроса')
    );
  }

  return data;
}