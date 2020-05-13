import * as bcrypt from "bcrypt";
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import userModel from "../users/user.model";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import LogInDto from "./logIn.dto";
import CreateUserDto from "../users/user.dto";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
  }

  private registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userData: CreateUserDto = req.body;
      const exist = await userModel.findOne({ email: userData.email });
      if (exist) {
        next(new UserWithThatEmailAlreadyExistsException(userData.email));
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });
      user.password = "";
      res.send(user);
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  };

  private loggingIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const logInData: LogInDto = req.body;
      const user = await this.user.findOne({ email: logInData.email });
      if (user) {
        const isPasswordMatching = await bcrypt.hash(logInData.password, 10);
        if (isPasswordMatching) {
          user.password = "";
          res.send(user);
        }
      }
      next(new WrongCredentialsException());
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  };
}

export default AuthenticationController;
