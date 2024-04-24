import { signIn, signOut, fetchAuthSession } from "@aws-amplify/auth";
import * as jwt from 'jsonwebtoken'; 

export interface AuthProviderOptions {
  authGroups?: string[];
}

const defaultOptions: { authGroups: string[] } = {
  authGroups: [],
};

export class AuthProvider {
  public authGroups: string[];

  public constructor(options?: AuthProviderOptions) {
    this.authGroups = options?.authGroups || defaultOptions.authGroups;
  }

  public login = async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }): Promise<unknown> => {
    return signIn({username, password});
  };

  public logout = (): Promise<any> => {
    return signOut();
  };

  public checkAuth = async (): Promise<void> => {
    const session = await fetchAuthSession();

    if (this.authGroups.length === 0) {
      return;
    }

    const token = session.tokens.idToken.toString();
    const payload = jwt.decode(token) as { [key: string]: any };
    const userGroups = payload['cognito:groups'];  

    if (!userGroups) {
      throw new Error("Unauthorized");
    }

    for (const group of userGroups) {
      if (this.authGroups.includes(group)) {
        return;
      }
    }

    throw new Error("Unauthorized");
  };

  public checkError = (): Promise<void> => {
    return Promise.resolve();
  };

  public getPermissions = async (): Promise<string[]> => {
    const session = await fetchAuthSession();

    const token = session.tokens.idToken.toString();
    const payload = jwt.decode(token) as { [key: string]: any };
    const groups = payload['cognito:groups'];  

    return groups ? Promise.resolve(groups) : Promise.reject();
  };
}
