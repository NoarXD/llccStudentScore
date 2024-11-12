import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Student from "@/models/student"

export async function PUT(req) {
    const { studentId, nameEng, nameLao, gen, gender, birthday } = await req.json()
    try {
        await connectDB()
        if(!studentId) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 })
        }
        await Student.findOneAndUpdate({ studentId }, { nameEng, nameLao, gen, gender, birthday })
        return NextResponse.json({ message: 'Student updated successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Error updating student' }, { status: 500 })
    }
}