import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  BACKEND_URL,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_WEB_CLIENT_SECRET,
} from "@env";
import { RegisterCalendarType } from "./bot";
const redirectUri = `${BACKEND_URL}/google/redirect`;

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export interface GoogleUser {
  idToken: string;
  serverAuthCode?: string;
  scopes: string[];
  user: {
    id: string;
    name: string;
    givenName: string;
    familyName: string;
    email: string;
    photo: string;
  };
}

class GoogleSignInService {
  private static instance: GoogleSignInService;
  private request: AuthSession.AuthRequest | null = null;

  private constructor() {
    this.initializeRequest();
  }

  public static getInstance(): GoogleSignInService {
    if (!GoogleSignInService.instance) {
      GoogleSignInService.instance = new GoogleSignInService();
    }
    return GoogleSignInService.instance;
  }

  private async initializeRequest() {
    try {
      // Get the correct redirect URI for the current environment
      const expoUri = AuthSession.makeRedirectUri();

      return (this.request = new AuthSession.AuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        scopes: [
          "openid",
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar",
        ],
        state: JSON.stringify({
          expoUri,
        }),
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: "offline",
          // prompt: "select_account",
          prompt: "consent",
        },
      }));
    } catch (error) {
      console.error("Failed to initialize Google Auth Request:", error);
    }
  }

  public async signIn(): Promise<GoogleUser | any> {
    try {
      // First, try to logout any existing session
      await this.signOut();

      if (!this.request) {
        await this.initializeRequest();
        if (!this.request) {
          throw new Error("Failed to initialize Google Auth Request");
        }
      }

      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        revocationEndpoint: "https://oauth2.googleapis.com/revoke",
      };

      const result = await this.request.promptAsync(discovery);

      if (result.type === "success") {
        // Exchange code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_WEB_CLIENT_ID,
            code: result.params.code,
            redirectUri: redirectUri,
            clientSecret: GOOGLE_WEB_CLIENT_SECRET,
            extraParams: {
              code_verifier: this.request.codeVerifier!,
            },
          },
          discovery
        );
        return tokenResult.accessToken;
      } else if (result.type === "cancel") {
        throw new Error("User cancelled the sign-in flow");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      // Clear any existing auth session
      await AuthSession.dismiss();

      // Clear any stored tokens or session data
      // For Expo AuthSession, we need to clear the session manually
      console.log("Google Sign-Out completed");
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
      // Don't throw error here as we want to continue with sign in
    }
  }

  public async forceSignOut(): Promise<void> {
    try {
      // Force logout by revoking tokens if available
      // This is a more aggressive logout
      await AuthSession.dismiss();

      // Clear any cached data
      console.log("Force Google Sign-Out completed");
    } catch (error) {
      console.error("Force Google Sign-Out Error:", error);
    }
  }

  public async getTokens(): Promise<{ accessToken: string; idToken: string }> {
    try {
      // This would need to be implemented based on your token storage strategy
      throw new Error("getTokens not implemented for Expo AuthSession");
    } catch (error) {
      console.error("Get Tokens Error:", error);
      throw error;
    }
  }

  public async registerCalendar(email: string): Promise<RegisterCalendarType> {
    try {
      await this.signOut();

      if (!this.request) {
        await this.initializeRequest();
        if (!this.request) {
          throw new Error("Failed to initialize Google Auth Request");
        }
      }

      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        revocationEndpoint: "https://oauth2.googleapis.com/revoke",
      };

      const result = await this.request.promptAsync(discovery);

      if (result.type === "success") {
        // Exchange code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_WEB_CLIENT_ID,
            code: result.params.code,
            redirectUri: redirectUri,
            clientSecret: GOOGLE_WEB_CLIENT_SECRET,
            extraParams: {
              code_verifier: this.request.codeVerifier!,
            },
          },
          discovery
        );
        const body = {
          accessToken: tokenResult.accessToken,
          refreshToken: tokenResult.refreshToken || "",
          email: email,
        };

        return body;
      } else if (result.type === "cancel") {
        throw new Error("User cancelled the sign-in flow");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  }
}

export default GoogleSignInService.getInstance();
