import { Request, Response } from "express";
import { getManager } from "typeorm";
import { UserRepository } from "./repository/user.repo";

export class AuthController {
  static async signUp(req: Request, res: Response) {
    let manager = getManager().getCustomRepository(UserRepository);
    await manager.signUp(req, res);
  }
  static async login(req: Request, res: Response) {
    let manager = getManager().getCustomRepository(UserRepository);
    await manager.login(req, res);
  }
  static async fetchUser(req: Request, res: Response) {
    let manager = getManager().getCustomRepository(UserRepository);
    await manager.fetchUser(req, res);
  }
}
