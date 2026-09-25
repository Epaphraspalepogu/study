import type { GenerateRequest, StudyMaterial, AppError } from '@/types/study';
import { validateStudyMaterial } from './validateResult';

const API_URL = '/api/generate';
const TIMEOUT_MS = 45000;

export interface GenerateOptions {
  signal?: AbortSignal;
}

export interface GenerateResponse {
  data?: StudyMaterial;
  error?: AppError;
}

export async function generateStudySession(
  request: GenerateRequest,
  options: GenerateOptions = {}
): Promise<GenerateResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // If caller provided a signal (e.g. from stale-request guard), listen to it
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.error || 'Something went wrong while generating your study session.';
      const type: AppError['type'] = res.status === 422 ? 'malformed' : 'api';
      return {
        error: {
          message,
          type,
          canRetry: true,
          canEdit: type === 'malformed',
        },
      };
    }

    const json = await res.json();
    const result = validateStudyMaterial(json);

    if (!result.valid || !result.data) {
      return {
        error: {
          message: result.error || 'The AI returned an unexpected format.',
          type: 'malformed',
          canRetry: true,
          canEdit: true,
        },
      };
    }

    return { data: result.data };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        error: {
          message: 'Taking longer than expected. Please try again.',
          type: 'timeout',
          canRetry: true,
          canEdit: false,
        },
      };
    }

    return {
      error: {
        message: 'Something went wrong while generating your study session.',
        type: 'network',
        canRetry: true,
        canEdit: false,
      },
    };
  }
}
