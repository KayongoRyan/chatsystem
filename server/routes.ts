import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertReelSchema, insertMessageSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(parsed.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const user = await storage.createUser(parsed);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    res.json(user);
  });

  // Users Routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  // Posts Routes
  app.get("/api/posts", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await storage.getPosts(limit);
    res.json(posts);
  });

  app.get("/api/users/:userId/posts", async (req, res) => {
    const posts = await storage.getUserPosts(req.params.userId);
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const parsed = insertPostSchema.parse({ ...req.body, userId });
      const post = await storage.createPost(parsed);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    
    await storage.deletePost(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/posts/:postId/like", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      await storage.likePost(req.params.postId, userId);
      res.json({ success: true });
    } catch {
      res.status(400).json({ error: "Failed to like post" });
    }
  });

  app.post("/api/posts/:postId/unlike", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    
    await storage.unlikePost(req.params.postId, userId);
    res.json({ success: true });
  });

  // Comments Routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.getPostComments(req.params.postId);
    res.json(comments);
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const parsed = insertCommentSchema.parse({
        postId: req.params.postId,
        userId,
        content: req.body.content,
      });
      const comment = await storage.createComment(parsed);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  // Reels Routes
  app.get("/api/reels", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const reels = await storage.getReels(limit);
    res.json(reels);
  });

  app.post("/api/reels", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const parsed = insertReelSchema.parse({ ...req.body, userId });
      const reel = await storage.createReel(parsed);
      res.json(reel);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/reels/:reelId/like", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      await storage.likeReel(req.params.reelId, userId);
      res.json({ success: true });
    } catch {
      res.status(400).json({ error: "Failed to like reel" });
    }
  });

  // Messages Routes
  app.get("/api/messages/conversations", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    
    const messages = await storage.getConversations(userId);
    res.json(messages);
  });

  app.get("/api/messages/:userId", async (req, res) => {
    const currentUserId = req.session.userId;
    if (!currentUserId) return res.status(401).json({ error: "Not authenticated" });
    
    const messages = await storage.getConversation(currentUserId, req.params.userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const senderId = req.session.userId;
      if (!senderId) return res.status(401).json({ error: "Not authenticated" });
      
      const parsed = insertMessageSchema.parse({ ...req.body, senderId });
      const message = await storage.sendMessage(parsed);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  // Follow Routes
  app.post("/api/users/:userId/follow", async (req, res) => {
    const followerId = req.session.userId;
    if (!followerId) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      await storage.followUser(followerId, req.params.userId);
      res.json({ success: true });
    } catch {
      res.status(400).json({ error: "Failed to follow user" });
    }
  });

  app.post("/api/users/:userId/unfollow", async (req, res) => {
    const followerId = req.session.userId;
    if (!followerId) return res.status(401).json({ error: "Not authenticated" });
    
    await storage.unfollowUser(followerId, req.params.userId);
    res.json({ success: true });
  });

  app.get("/api/users/:userId/followers", async (req, res) => {
    const followers = await storage.getFollowers(req.params.userId);
    res.json(followers);
  });

  app.get("/api/users/:userId/following", async (req, res) => {
    const following = await storage.getFollowing(req.params.userId);
    res.json(following);
  });

  return httpServer;
}
