import { UserAgentApplication } from '../../msal';

const CLIENT_ID = 'd3d4f154-9add-4001-993a-90d13bfb2d57';
const REDIRECT_URI = 'http://localhost:3000';
const SCOPES = [
  'Files.ReadWrite.All'
];

export function getAuthToken(scopes: string[] = SCOPES): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const userAgentApplication = new UserAgentApplication(
      CLIENT_ID,
      '',
      () => { /* no-op */ },
      {
        redirectUri: REDIRECT_URI
      }
    );

    let user = userAgentApplication.getUser();

    if (!user) {
      await userAgentApplication.loginPopup(['Files.ReadWrite.All']);

      user = userAgentApplication.getUser();
    }

    if (!user) {
      // Did not log in.
    }

    // Get the token.
    let token = await userAgentApplication.acquireTokenSilent(scopes);

    if (!token) {
      token = await userAgentApplication.acquireTokenPopup(scopes);
    }

    resolve(token);
  });
}
