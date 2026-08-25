import {
  meddxAccessTokenProviderConfigured,
  setMEDDxAccessTokenProvider,
  type MEDDxAccessTokenProvider,
} from "../api/meddx";

export interface MEDDxAuthAdapter {
  /**
   * Return the current short-lived access token for the signed-in user.
   * Implementations should obtain this from the selected identity provider at
   * request time rather than persisting tokens in localStorage or Vite config.
   */
  getAccessToken: MEDDxAccessTokenProvider;
}

let activeAdapter: MEDDxAuthAdapter | null = null;

/**
 * Connect a provider-specific authentication SDK to the MEDDxAgent API client
 * without coupling application code to that vendor. Calling this again safely
 * replaces the current adapter (for example after an auth provider remount).
 */
export function configureMEDDxAuth(adapter: MEDDxAuthAdapter) {
  activeAdapter = adapter;
  setMEDDxAccessTokenProvider(() => activeAdapter?.getAccessToken() ?? null);
}

/** Disconnect the current authentication adapter and stop attaching bearer tokens. */
export function clearMEDDxAuth() {
  activeAdapter = null;
  setMEDDxAccessTokenProvider(null);
}

export function meddxAuthConfigured() {
  return activeAdapter !== null && meddxAccessTokenProviderConfigured();
}

export function getMEDDxAuthAdapter() {
  return activeAdapter;
}
