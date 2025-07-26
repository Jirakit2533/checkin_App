import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";


// ตารางผู้ใช้
export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }), // Removed .optional()
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  employeeCode: varchar("employee_code", { length: 100 }),
});

// ตารางเช็คอิน
export const checkIns = pgTable("check_ins", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  coordinates: varchar("coordinates", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  dateTime: varchar("date_time", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 255 }),
});


// Zod schema for user registration
export const register = z.object({
  userId: z.string().min(3, "User ID ต้องมีอย่างน้อย 3 ตัวอักษร"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  fullName: z.string().min(1, "กรุณากรอกชื่อเต็ม"),
  address: z.string().max(255, "ที่อยู่ต้องไม่เกิน 255 ตัวอักษร").optional(),
  phone: z.string().max(10, "เบอร์โทรต้องไม่เกิน 10 ตัวอักษร").optional(),
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง").optional(),
  employeeCode: z.string().max(10, "รหัสพนักงานต้องไม่เกิน 10 ตัวอักษร").optional(),
});

process.env.PG_FORCE_NATIVE = "false";

