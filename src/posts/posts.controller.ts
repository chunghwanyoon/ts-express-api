import express, { Request, Response } from "express";
import Post from "./post.interface";
import postModel from "./posts.model";
import Controller from "../interfaces/controller.interface";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(`${this.path}`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }

  private getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.post.find();
      res.status(200).send(posts);
    } catch (err) {
      res.status(404);
      res.send(err.message);
    }
  };

  private getPostById = async (req: Request, res: Response) => {
    try {
      const id = req.body;
      const post = await this.post.findById(id);
      res.status(200).send(post);
    } catch (err) {
      res.status(404);
      res.send(err.message);
    }
  };

  private modifyPost = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const postData: Post = req.body;
      const updatedPost = await this.post.findByIdAndUpdate(id, postData, {
        new: true
      });
      res.status(200).send(updatedPost);
    } catch (err) {
      res.status(404);
      res.send(err.message);
    }
  };

  private deletePost = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deletePost = await this.post.findByIdAndDelete(id);
      res.sendStatus(200);
    } catch (err) {
      res.status(404);
      res.send(err.message);
    }
  };

  private createPost = async (req: Request, res: Response) => {
    try {
      const postData: Post = req.body;
      const createdPost = new this.post(postData);
      await createdPost.save();
      res.status(200).send(createdPost);
    } catch (err) {
      res.status(404);
      res.send(err.message);
    }
  };
}

export default PostsController;
