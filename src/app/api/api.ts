import { db } from "@/db/client";
import { register, users, checkIns } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Register User
export async function registerUser(userData: any) {
  try {
    // Validate input
    const registerUserSchema = z.object({
      userId: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
      fullName: z.string(),
      address: z.string(),
      phone: z.string(),
      email: z.string().email(),
      employeeCode: z.string(),
    });
    const data = registerUserSchema.parse(userData);

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.userId, data.userId));
    if (existing.length > 0) {
      return { success: false, message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" };
    }

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      return { success: false, message: "รหัสไม่ถูกต้อง" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert user into the database
    await db.insert(users).values({
      userId: data.userId,
      password: hashedPassword,
      fullName: data.fullName,
      address: data.address,
      phone: data.phone,
      email: data.email,
      employeeCode: data.employeeCode,
    });

    return { success: true, message: "ลงทะเบียนสำเร็จ" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "ข้อมูลผิดพลาด", errors: error.issues };
    }
    console.error("การลงทะเบียนล้มเหลว:", error);
    return { success: false, message: "การลงทะเบียนล้มเหลว" };
  }
}

// Login User
export async function loginUser(credentials: { userId: string; password: string }) {
  try {
    // Validate input
    const loginSchema = z.object({
      userId: z.string(),
      password: z.string(),
    });
    const data = loginSchema.parse(credentials);

    // Find user in the database
    const result = await db.select().from(users).where(eq(users.userId, data.userId));
    const user = result[0];

    if (!user) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านผิด" };
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านผิด" };
    }

    return { success: true, message: "ลงชื่อเข้าใช้สำเร็จ", user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "ข้อมูลไม่ถูกต้อง", errors: error.issues };
    }
    console.error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ:", error);
    return { success: false, message: "เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ" };
  }
}

// Check-in
export async function checkIn(data: {
  userId: string;
  coordinates: string;
  address: string;
  dateTime: string;
  photoUrl: string;
}) {
  try {
    // Insert check-in record into DB
    await db.insert(checkIns).values({
      userId: data.userId,
      coordinates: data.coordinates,
      address: data.address,
      dateTime: data.dateTime,
      photoUrl: data.photoUrl,
    });

    console.log(`User ${data.userId} checked in at ${data.address} on ${data.dateTime}`);

    return { success: true, message: "Check-in successful" };
  } catch (error) {
    console.error("Error during check-in:", error);
    return { success: false, message: "เกิดข้อผิดพลาดระหว่างการเช็คอิน" };
  }
}
