import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  const { userId, password } = req.body;

  if (!userId || !password)
    return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });

  try {
    const user = await db.select().from(users).where(users.userId.eq(userId)).limit(1);
    if (user.length === 0) return res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านผิด" });

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) return res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านผิด" });

    // หากต้องการ ทำ session หรือ JWT ก็เพิ่มตรงนี้

    return res.status(200).json({ success: true, message: "เข้าสู่ระบบสำเร็จ", user: { userId: user[0].userId, fullName: user[0].fullName } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
}
