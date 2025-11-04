import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    usersEmailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const footScans = pgTable("foot_scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  scanType: text("scan_type").default("photo"),
  depthMapUrl: text("depth_map_url"),
  artifactUrls: jsonb("artifact_urls"),
  archType: text("arch_type"),
  pronationType: text("pronation_type"),
  archConfidence: integer("arch_confidence"),
  pronationConfidence: integer("pronation_confidence"),
  stanceWidthMm: integer("stance_width_mm"),
  rawAnalysis: jsonb("raw_analysis"),
  notes: text("notes"),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow(),
});

export const shoeCatalog = pgTable(
  "shoe_catalog",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    category: text("category").notNull(),
    cushioning: text("cushioning"),
    stability: text("stability"),
    stackHeightMm: integer("stack_height_mm"),
    dropMm: integer("drop_mm"),
    features: jsonb("features"),
    tags: jsonb("tags"),
    isRecommended: boolean("is_recommended").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    shoeCatalogSlugIdx: uniqueIndex("shoe_catalog_slug_idx").on(table.slug),
  }),
);

export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  footScanId: uuid("foot_scan_id")
    .notNull()
    .references(() => footScans.id, { onDelete: "cascade" }),
  shoeId: uuid("shoe_id").references(() => shoeCatalog.id, {
    onDelete: "set null",
  }),
  category: text("category").notNull(),
  rationale: text("rationale").notNull(),
  confidenceScore: integer("confidence_score"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  footScanId: uuid("foot_scan_id").references(() => footScans.id, {
    onDelete: "set null",
  }),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  footScans: many(footScans),
  events: many(events),
}));

export const footScansRelations = relations(footScans, ({ one, many }) => ({
  user: one(users, {
    fields: [footScans.userId],
    references: [users.id],
  }),
  recommendations: many(recommendations),
  events: many(events),
}));

export const recommendationsRelations = relations(
  recommendations,
  ({ one }) => ({
    footScan: one(footScans, {
      fields: [recommendations.footScanId],
      references: [footScans.id],
    }),
    shoe: one(shoeCatalog, {
      fields: [recommendations.shoeId],
      references: [shoeCatalog.id],
    }),
  }),
);

export const shoeCatalogRelations = relations(shoeCatalog, ({ many }) => ({
  recommendations: many(recommendations),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  footScan: one(footScans, {
    fields: [events.footScanId],
    references: [footScans.id],
  }),
}));
