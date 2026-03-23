import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  datetime,
  boolean,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: text("password").notNull(),
  avatar: text("avatar").notNull(),
  bio: text("bio"),
  followers: int("followers").notNull().default(0),
  following: int("following").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  likes: int("likes").notNull().default(0),
  location: text("location"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Comments Table
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  postId: varchar("post_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  likes: int("likes").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Reels Table
export const reels = mysqlTable("reels", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  videoUrl: text("video_url").notNull(),
  caption: text("caption"),
  likes: int("likes").notNull().default(0),
  comments: int("comments").notNull().default(0),
  shares: int("shares").notNull().default(0),
  musicTrack: text("music_track"),
  isViralContent: boolean("is_viral_content").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  senderId: varchar("sender_id", { length: 36 }).notNull(),
  recipientId: varchar("recipient_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Post Likes Table
export const postLikes = mysqlTable("post_likes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  postId: varchar("post_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Reel Likes Table
export const reelLikes = mysqlTable("reel_likes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  reelId: varchar("reel_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Follow Relationships
export const follows = mysqlTable("follows", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  followerId: varchar("follower_id", { length: 36 }).notNull(),
  followeeId: varchar("followee_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Sounds/Music Library
export const sounds = mysqlTable("sounds", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 512 }).notNull(),
  artist: text("artist"),
  audioUrl: text("audio_url").notNull(),
  duration: int("duration"),
  uses: int("uses").notNull().default(0),
  createdBy: varchar("created_by", { length: 36 }),
  isTrending: boolean("is_trending").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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
export const challenges = mysqlTable("challenges", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 512 }).notNull(),
  description: text("description"),
  hashtag: varchar("hashtag", { length: 255 }).notNull().unique(),
  coverImage: text("cover_image"),
  soundId: varchar("sound_id", { length: 36 }),
  participationCount: int("participation_count").notNull().default(0),
  views: int("views").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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

// Duets
export const duets = mysqlTable("duets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  creatorId: varchar("creator_id", { length: 36 }).notNull(),
  originalReelId: varchar("original_reel_id", { length: 36 }).notNull(),
  duetVideoUrl: text("duet_video_url").notNull(),
  caption: text("caption"),
  likes: int("likes").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertDuetSchema = createInsertSchema(duets).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export type InsertDuet = z.infer<typeof insertDuetSchema>;
export type Duet = typeof duets.$inferSelect;

// Stories
export const stories = mysqlTable("stories", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  views: int("views").notNull().default(0),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  views: true,
  createdAt: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Group Chats
export const groupChats = mysqlTable("group_chats", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  profileImage: text("profile_image"),
  createdBy: varchar("created_by", { length: 36 }).notNull(),
  memberCount: int("member_count").notNull().default(1),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertGroupChatSchema = createInsertSchema(groupChats).omit({
  id: true,
  memberCount: true,
  createdAt: true,
});

export type InsertGroupChat = z.infer<typeof insertGroupChatSchema>;
export type GroupChat = typeof groupChats.$inferSelect;

// Group Chat Members
export const groupChatMembers = mysqlTable("group_chat_members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  groupChatId: varchar("group_chat_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  role: varchar("role", { length: 32 }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
});

// Group Chat Messages
export const groupMessages = mysqlTable("group_messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  groupChatId: varchar("group_chat_id", { length: 36 }).notNull(),
  senderId: varchar("sender_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  voiceUrl: text("voice_url"),
  voiceDuration: int("voice_duration"),
  isRead: boolean("is_read").notNull().default(false),
  // datetime (not timestamp) for nullable — avoids MariaDB ER_INVALID_DEFAULT on nullable TIMESTAMP
  disappearsAt: datetime("disappears_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;

// Message Reactions
export const messageReactions = mysqlTable("message_reactions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  messageId: varchar("message_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  emoji: varchar("emoji", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// messages_v2 (legacy table name kept)
export const updatedMessages = mysqlTable("messages_v2", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  senderId: varchar("sender_id", { length: 36 }).notNull(),
  recipientId: varchar("recipient_id", { length: 36 }).notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  voiceUrl: text("voice_url"),
  voiceDuration: int("voice_duration"),
  isRead: boolean("is_read").notNull().default(false),
  disappearsAt: datetime("disappears_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Chat Streaks
export const chatStreaks = mysqlTable("chat_streaks", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  user1Id: varchar("user1_id", { length: 36 }).notNull(),
  user2Id: varchar("user2_id", { length: 36 }).notNull(),
  streakCount: int("streak_count").notNull().default(0),
  lastMessageDate: datetime("last_message_date", { mode: "date" }),
  startedAt: timestamp("started_at", { mode: "date" }).notNull().defaultNow(),
});

// Call Sessions
export const callSessions = mysqlTable("call_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  callerId: varchar("caller_id", { length: 36 }).notNull(),
  recipientId: varchar("recipient_id", { length: 36 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("ringing"),
  callType: varchar("call_type", { length: 32 }).notNull().default("audio"),
  duration: int("duration"),
  startedAt: timestamp("started_at", { mode: "date" }).notNull().defaultNow(),
  endedAt: datetime("ended_at", { mode: "date" }),
});

export const insertCallSessionSchema = createInsertSchema(callSessions).omit({
  id: true,
  startedAt: true,
  endedAt: true,
});

export type InsertCallSession = z.infer<typeof insertCallSessionSchema>;
export type CallSession = typeof callSessions.$inferSelect;
