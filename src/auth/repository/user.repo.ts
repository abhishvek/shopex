import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  //Get user data
  async fetchUser(req: any, res: Response) {
    const Btoken = req.headers["authorization"];
    if (typeof Btoken !== undefined) {
      req.token = Btoken;
      jwt.verify(req.token, "mykey", async (error: any, authData: any) => {
        if (error) {
          res.send(error);
        } else {
          let data = await this.createQueryBuilder("user").select().getMany();
          res.send(data);
        }
      });
    }
  }

  //Create a new user
  async signUp(req: Request, res: Response) {
    const { username, useremail, userpassword } = req.body;

    try {
      let validate = EmailValidator.validate(useremail);
      if (!validate) {
        res.status(500).json({
          error: "Invalid email",
        });
      } else {
        let emailExists =
          (await this.createQueryBuilder("user")
            .where("user.useremail = :query", { query: useremail })
            .getCount()) > 0;
        if (emailExists) {
          res.send({
            data: "Email is already taken!",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          await bcrypt.hash(userpassword, salt, async (error, data) => {
            if (error) {
              res.send(error);
            } else {
              let user = new User();
              user.username = username;
              user.userpassword = data;
              user.useremail = useremail;

              await this.save(user);

              let userId = this.createQueryBuilder("user")
                .select("user.id")
                .where("user.useremail = :query", { query: useremail })
                .getOne();

              var token = jwt.sign({ id: userId }, "mykey", {
                expiresIn: 86400,
              });

              res.send({
                authentication: true,
                token: token,
              });
            }
          });
        }
      }
    } catch (error) {
      res.send(error);
    }
  }

  async login(req: Request, res: Response) {
    const { useremail, userpassword } = req.body;

    let validate = EmailValidator.validate(useremail);
    if (!validate) {
      res.json({
        error: "User not found!",
      });
    } else {
      let findUserFromDB = await this.createQueryBuilder("user")
        .select("user.userpassword")
        .where("user.useremail = :query", { query: useremail })
        .getOne();

      let userId = this.createQueryBuilder("user")
        .select("user.id")
        .where("user.useremail = :query", { query: useremail })
        .getOne();

      await bcrypt.compare(
        userpassword,
        findUserFromDB?.userpassword as string,
        (error, result) => {
          if (error) {
            res.send(error);
          }
          if (!result) return res.send("Authentication error");
          if (result) {
            var token = jwt.sign({ id: userId }, "mykey", {
              expiresIn: 86400,
            });

            res.send({
              authentication: true,
              token: token,
            });
          }
        }
      );
    }
  }
}
