// นำเข้าโมเดลนักเรียน
import Student from "../../../../models/student";
// เชื่อมต่อกับฐานข้อมูล
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// ฟังก์ชันสำหรับการเพิ่มนักเรียน
export async function POST(req) {
    try {
        // ดึงข้อมูลจากคำขอ
        const { gender, firstNameEng, lastNameEng, firstNameLao, lastNameLao, gen, birthday } = await req.json();
        // ตรวจสอบว่าข้อมูลทั้งหมดถูกกรอกหรือไม่
        if (!gender || !firstNameEng || !lastNameEng || !firstNameLao || !lastNameLao || !gen || !birthday) {
            return NextResponse.json({ message: "ทุกฟิลด์ต้องถูกกรอก" }, { status: 400 });
        }

        // เชื่อมต่อกับฐานข้อมูล
        await connectDB();

        // แปลงวันเกิดเป็นวันที่
        const birthDate = new Date(birthday);
        const yearOfBirth = birthDate.getFullYear().toString().slice(-2);
        const monthOfBirth = String(birthDate.getMonth() + 1).padStart(2, '0');

        // นับจำนวนของนักเรียนในรุ่น
        let studentCount = await Student.countDocuments({ gen });
        let paddedCount;
        let studentId;
        let isUnique = false;

        // สร้าง studentId ที่ไม่ซ้ำกัน
        do {
            paddedCount = String(studentCount + 1);
            studentId = `${gen}${yearOfBirth}${monthOfBirth}${paddedCount}`;
            const existingStudent = await Student.findOne({ studentId });
            isUnique = !existingStudent;
            if (!isUnique) studentCount++;
        } while (!isUnique);

        // สร้างนักเรียนใหม่ในฐานข้อมูล
        await Student.create({ studentId, gender, firstNameEng, lastNameEng, firstNameLao, lastNameLao, gen, birthday });

        // ค้นหานักเรียนที่เพิ่งสร้าง
        const student = await Student.findOne({ studentId });

        // ตรวจสอบคะแนนของนักเรียน
        if (!student.scores || !student.scores.length) {
            student.scores = {
                term1: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    wordCombination: 0,
                },
                term2: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    tense: 0,
                },
                term3: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    tense: 0,
                },
                term4: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    listening: 0,
                    translation: 0,
                },
                term5: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    listening: 0,
                    translation: 0,
                },
                term6: {
                    reading: 0,
                    speaking: 0,
                    grammar: 0,
                    listening: 0,
                    translation: 0,
                },
            };
        }

        // บันทึกข้อมูลนักเรียน
        await student.save();
        revalidatePath("/");
        revalidatePath("/admin/dashboard/studentscore");
        revalidatePath("/admin/dashboard/editstudent");
        return NextResponse.json({ message: "เพิ่มนักเรียนสำเร็จ" }, { status: 200 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มนักเรียน:", error);
        return NextResponse.json({ message: "การเพิ่มนักเรียนล้มเหลว", error: error.message }, { status: 500 });
    }
}
