import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Student from "@/models/student"
import { revalidatePath } from "next/cache"

export async function PUT(req) {
    const { studentId, firstNameEng, lastNameEng, firstNameLao, lastNameLao, gen, gender, birthday } = await req.json()
    try {
        await connectDB()
        if (!studentId) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 })
        }
        await Student.findOneAndUpdate({ studentId }, { firstNameEng, lastNameEng, firstNameLao, lastNameLao, gen, gender, birthday })
        revalidatePath("/");
        revalidatePath("/admin/dashboard/studentscore");
        revalidatePath("/admin/dashboard/editstudent");
        return NextResponse.json({ message: 'Student updated successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Error updating student' }, { status: 500 })
    }
}