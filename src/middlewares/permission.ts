import { Request, Response, NextFunction } from "express";
import { decode, verify } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";
import User from "../models/User";

async function decoder(request: Request): Promise<User | undefined> {

  try {
    const authHeader = request.headers.authorization || "";

    const userRepository = getCustomRepository(UserRepository);

    const [, token] = authHeader?.split(" ");

    const payload = decode(token);

    console.log("payload", payload)

    const user = await userRepository.findOne(payload?.sub, {
      relations: ["roles"],
    });

    const valid = verify(token, "93eea6a2c12628b3a3b7618f6882c912")

    return user;

  } catch (error) {
    return undefined
  }
}

function is(role: String[]) {

  const roleAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {

    const user = await decoder(request);

    const userRoles = user?.roles.map((role) => role.name);

    const existsRoles = userRoles?.some((r) => role.includes(r));

    console.log(user)

    if (existsRoles) {
      return next();
    }
    return response.status(401).json({ message: "Not authorized!" });
  };

  return roleAuthorized;
}

export { is };
