import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { checkins } from "@/db/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  const { userId, coordinates, address, dateTime, photoUrl } = req.body;

  if (!userId || !coordinates || !address || !dateTime)
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });

  try {
    await db.insert(checkins).values({
      userId,
      coordinates,
      address,
      dateTime,
      photoUrl,
    });

    return res.status(201).json({ success: true, message: "เช็คอินสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการเช็คอิน" });
  }
}
