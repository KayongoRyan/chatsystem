import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  avatar: text("avatar").notNull(),
  bio: text("bio"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  followers: true,
  following: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Posts Table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  likes: integer("likes").notNull().default(0),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Comments Table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Reels Table
export const reels = pgTable("reels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  videoUrl: text("video_url").notNull(),
  caption: text("caption"),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  musicTrack: text("music_track"),
  isViralContent: boolean("is_viral_content").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertReelSchema = createInsertSchema(reels).omit({
  id: true,
  likes: true,
  comments: true,
  shares: true,
  isViralContent: true,
  createdAt: true,
});

export type InsertReel = z.infer<typeof insertReelSchema>;
export type Reel = typeof reels.$inferSelect;

// Messages Table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull(),
  recipientId: varchar("recipient_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Post Likes Table
export const postLikes = pgTable("post_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Reel Likes Table
export const reelLikes = pgTable("reel_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reelId: varchar("reel_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Follow Relationships
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull(),
  followeeId: varchar("followee_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// TikTok-inspired Features

// Sounds/Music Library
export const sounds = pgTable("sounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  artist: text("artist"),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"), // seconds
  uses: integer("uses").notNull().default(0), // How many videos use this sound
  createdBy: varchar("created_by"), // User ID who uploaded it
  isTrending: boolean("is_trending").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertSoundSchema = createInsertSchema(sounds).omit({
  id: true,
  uses: true,
  isTrending: true,
  createdAt: true,
});

export type InsertSound = z.infer<typeof insertSoundSchema>;
export type Sound = typeof sounds.$inferSelect;

// Challenges/Trends
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  hashtag: text("hashtag").notNull().unique(),
  coverImage: text("cover_image"),
  soundId: varchar("sound_id"), // Associated sound
  participationCount: integer("participation_count").notNull().default(0),
  views: integer("views").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  participationCount: true,
  views: true,
  isFeatured: true,
  createdAt: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// Duets (Videos created with other users)
export const duets = pgTable("duets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull(),
  originalReelId: varchar("original_reel_id").notNull(),
  duetVideoUrl: text("duet_video_url").notNull(),
  caption: text("caption"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertDuetSchema = createInsertSchema(duets).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertDuet = z.infer<typeof insertDuetSchema>;
export type Duet = typeof duets.$inferSelect;
