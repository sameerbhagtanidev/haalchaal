import type { JwtPayloadWithData } from "../utils/tokens.util.js";
import type { IUser } from "../models/user.model.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadWithData | IUser | null;
        }
    }
}
