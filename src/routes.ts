import { AuthController } from "./auth/auth_controller";
import Router from "express";

const router = Router();

//Default
router.get("/", (req, res) => {
  res.send({
    message: "API IS WORKING!",
  });
});

router.get("/user", AuthController.fetchUser);

// Signing in
router.post("/user/signup", AuthController.signUp);

//Loging in
router.post("/user/login", AuthController.login);

export { router };
