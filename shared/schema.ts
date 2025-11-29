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

// Stories/Status (24-hour disappearing content)
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  views: integer("views").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(), // Auto-delete after 24h
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  views: true,
  createdAt: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Group Chats
export const groupChats = pgTable("group_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  profileImage: text("profile_image"),
  createdBy: varchar("created_by").notNull(),
  memberCount: integer("member_count").notNull().default(1),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertGroupChatSchema = createInsertSchema(groupChats).omit({
  id: true,
  memberCount: true,
  createdAt: true,
});

export type InsertGroupChat = z.infer<typeof insertGroupChatSchema>;
export type GroupChat = typeof groupChats.$inferSelect;

// Group Chat Members
export const groupChatMembers = pgTable("group_chat_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupChatId: varchar("group_chat_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default("member"), // admin, moderator, member
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
});

// Group Chat Messages
export const groupMessages = pgTable("group_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupChatId: varchar("group_chat_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  voiceUrl: text("voice_url"),
  voiceDuration: integer("voice_duration"), // seconds
  isRead: boolean("is_read").notNull().default(false),
  disappearsAt: timestamp("disappears_at"), // For disappearing messages
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;

// Message Reactions (Emojis on messages)
export const messageReactions = pgTable("message_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  userId: varchar("user_id").notNull(),
  emoji: text("emoji").notNull(), // ❤️, 😂, 🔥, 😢, etc
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Updated Messages Table with voice support
export const updatedMessages = pgTable("messages_v2", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull(),
  recipientId: varchar("recipient_id").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  voiceUrl: text("voice_url"),
  voiceDuration: integer("voice_duration"), // seconds
  isRead: boolean("is_read").notNull().default(false),
  disappearsAt: timestamp("disappears_at"), // Snapchat-style disappearing
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Chat Streaks (WhatsApp/Snapchat style)
export const chatStreaks = pgTable("chat_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull(),
  user2Id: varchar("user2_id").notNull(),
  streakCount: integer("streak_count").notNull().default(0),
  lastMessageDate: timestamp("last_message_date"),
  startedAt: timestamp("started_at").notNull().default(sql`now()`),
});
