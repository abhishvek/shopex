import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";

//200 => OK
//201 => Email is taken
//202 => Wrong password
//203 => Invalid Email
//204 => Email does not exists
//500 => Internal Server error

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async fetchUser(req: any, res: Response) {
    try {
      let data = await this.createQueryBuilder("user").select().getMany();
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  }

  //Create a new user
  async signUp(req: Request, res: Response) {
    const { username, useremail, userpassword } = req.body;
    try {
      let validate = EmailValidator.validate(useremail);
      if (!validate) {
        res.status(203).send({
          authentication: false,
          data: "Invalid email",
        });
      } else {
        let emailExists =
          (await this.createQueryBuilder("user")
            .where("user.useremail = :query", { query: useremail })
            .getCount()) > 0;
        if (emailExists) {
          res.status(201).send({
            authentication: false,
            data: "Email is already taken!",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          await bcrypt.hash(userpassword, salt, async (error, data) => {
            if (error) {
              res.status(500).send({
                authentication: false,
                data: error,
              });
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

              res.status(200).send({
                authentication: true,
                data: token,
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
      return res.status(204).send({
        authentication: false,
        data: "User not found",
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
            return res.status(500).send({
              authentication: false,
              data: "Authentication error",
            });
          }
          if (!result) {
            return res.status(500).send({
              authentication: false,
              data: "Authentication error",
            });
          }
          if (result) {
            var token = jwt.sign({ id: userId }, "mykey", {
              expiresIn: 86400,
            });

            res.status(200).send({
              authentication: true,
              data: token,
            });
          }
        }
      );
    }
  }
}
