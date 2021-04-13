import { AuthController } from "./auth/auth_controller";
import Router from "express";

const router = Router();

router.get("/user", AuthController.fetchUser);

// Signing in
router.post("/user/signup", AuthController.signUp);

//Loging in
router.post("/user/login", AuthController.login);

export { router };
