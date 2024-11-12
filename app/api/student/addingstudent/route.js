import Student from "../../../../models/student";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { gender, nameEng, nameLao, gen, birthday } = await req.json();
        if (!gender || !nameEng || !nameLao || !gen || !birthday) {
            return NextResponse.json({ message: "All fields are required"}, { status: 400 });
        }
        await connectDB();
        const students = await Student.find({ gen });
        const studentCount = students.length;
        const paddedCount = String(studentCount + 1).padStart(4, '0');
        const studentId = `${gen}${paddedCount}`;
        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) {
            return NextResponse.json({ 
                message: "Student ID already exists", 
                status: 400 
            });
        }

        await Student.create({ studentId, gender, nameEng, nameLao, gen, birthday});
        return NextResponse.json({ message: "Adding Student Success", status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Adding Student Failed", error: error.message, status: 500 });
    }
}