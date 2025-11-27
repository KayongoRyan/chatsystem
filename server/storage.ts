import { db } from "./db";
import { users, posts, comments, reels, messages, postLikes, reelLikes, follows } from "@shared/schema";
import { type InsertUser, type User, type InsertPost, type Post, type InsertComment, type Comment, type InsertMessage, type Message, type InsertReel, type Reel } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Posts
  getPosts(limit?: number): Promise<(Post & { user: User; comments: Comment[] })[]>;
  getUserPosts(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: string): Promise<void>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;

  // Comments
  getPostComments(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Reels
  getReels(limit?: number): Promise<Reel[]>;
  createReel(reel: InsertReel): Promise<Reel>;
  deleteReel(id: string): Promise<void>;
  likeReel(reelId: string, userId: string): Promise<void>;
  unlikeReel(reelId: string, userId: string): Promise<void>;

  // Messages
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  getConversations(userId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markAsRead(messageId: string): Promise<void>;

  // Follows
  followUser(followerId: string, followeeId: string): Promise<void>;
  unfollowUser(followerId: string, followeeId: string): Promise<void>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Posts
  async getPosts(limit: number = 10): Promise<(Post & { user: User; comments: Comment[] })[]> {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit);
    
    const enriched = await Promise.all(
      allPosts.map(async (post) => {
        const user = await this.getUser(post.userId);
        const postComments = await this.getPostComments(post.id);
        return { ...post, user: user!, comments: postComments };
      })
    );
    
    return enriched;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await db.insert(postLikes).values({ postId, userId });
    const post = await this.getPosts(999).then(p => p.find(x => x.id === postId));
    if (post) {
      await db.update(posts).set({ likes: post.likes + 1 }).where(eq(posts.id, postId));
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    const post = await this.getPosts(999).then(p => p.find(x => x.id === postId));
    if (post && post.likes > 0) {
      await db.update(posts).set({ likes: post.likes - 1 }).where(eq(posts.id, postId));
    }
  }

  // Comments
  async getPostComments(postId: string): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.postId, postId)).orderBy(comments.createdAt);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Reels
  async getReels(limit: number = 10): Promise<Reel[]> {
    return await db.select().from(reels).orderBy(desc(reels.createdAt)).limit(limit);
  }

  async createReel(reel: InsertReel): Promise<Reel> {
    const result = await db.insert(reels).values(reel).returning();
    return result[0];
  }

  async deleteReel(id: string): Promise<void> {
    await db.delete(reels).where(eq(reels.id, id));
  }

  async likeReel(reelId: string, userId: string): Promise<void> {
    await db.insert(reelLikes).values({ reelId, userId });
    const reel = await db.select().from(reels).where(eq(reels.id, reelId)).limit(1);
    if (reel[0]) {
      await db.update(reels).set({ likes: reel[0].likes + 1 }).where(eq(reels.id, reelId));
    }
  }

  async unlikeReel(reelId: string, userId: string): Promise<void> {
    await db.delete(reelLikes).where(and(eq(reelLikes.reelId, reelId), eq(reelLikes.userId, userId)));
    const reel = await db.select().from(reels).where(eq(reels.id, reelId)).limit(1);
    if (reel[0] && reel[0].likes > 0) {
      await db.update(reels).set({ likes: reel[0].likes - 1 }).where(eq(reels.id, reelId));
    }
  }

  // Messages
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const msgs = await db.select().from(messages).where(
      and(
        eq(messages.senderId, userId1),
        eq(messages.recipientId, userId2),
      )
    ).orderBy(messages.createdAt);
    
    const msgs2 = await db.select().from(messages).where(
      and(
        eq(messages.senderId, userId2),
        eq(messages.recipientId, userId1),
      )
    ).orderBy(messages.createdAt);
    
    return [...msgs, ...msgs2].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversations(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(
      eq(messages.recipientId, userId)
    ).orderBy(desc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async markAsRead(messageId: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
  }

  // Follows
  async followUser(followerId: string, followeeId: string): Promise<void> {
    await db.insert(follows).values({ followerId, followeeId });
    const user = await this.getUser(followeeId);
    if (user) {
      await this.updateUser(followeeId, { followers: user.followers + 1 });
    }
    const follower = await this.getUser(followerId);
    if (follower) {
      await this.updateUser(followerId, { following: follower.following + 1 });
    }
  }

  async unfollowUser(followerId: string, followeeId: string): Promise<void> {
    await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
    const user = await this.getUser(followeeId);
    if (user && user.followers > 0) {
      await this.updateUser(followeeId, { followers: user.followers - 1 });
    }
    const follower = await this.getUser(followerId);
    if (follower && follower.following > 0) {
      await this.updateUser(followerId, { following: follower.following - 1 });
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followerIds = await db.select({ followerId: follows.followerId }).from(follows).where(eq(follows.followeeId, userId));
    const followerUsers = await Promise.all(
      followerIds.map(f => this.getUser(f.followerId))
    );
    return followerUsers.filter((u): u is User => u !== undefined);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const followingIds = await db.select({ followeeId: follows.followeeId }).from(follows).where(eq(follows.followerId, userId));
    const followingUsers = await Promise.all(
      followingIds.map(f => this.getUser(f.followeeId))
    );
    return followingUsers.filter((u): u is User => u !== undefined);
  }
}

export const storage = new DatabaseStorage();
