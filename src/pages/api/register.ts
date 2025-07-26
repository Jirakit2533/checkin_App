import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  const { userId, password, fullName, address = "", phone = "", email = "", employeeCode = "" } = req.body;

  if (!userId || !password || !fullName)
    return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });

  try {
    const existingUser = await db.select().from(users).where(users.userId.eq(userId));
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "User ID นี้ถูกใช้แล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      userId,
      password: hashedPassword,
      fullName,
      address,
      phone,
      email,
      employeeCode,
    });

    return res.status(201).json({ success: true, message: "ลงทะเบียนสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
}
