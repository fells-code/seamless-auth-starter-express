import { SeamlessAuthUser } from "@seamless-auth/express";

export type appUser = {
  id: string;
  email: string;
  phone: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: SeamlessAuthUser;
      appUser?: appUser;
    }
  }
}
