import { Request } from "express";
/**
 * User Request
 *
 * An user request is one made after authtication has been done. At which point all requests should have the user on it.
 */
export interface UserRequest extends Request {
  user?: User;
}
