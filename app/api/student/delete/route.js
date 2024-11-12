import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Student from '@/models/student'

export async function DELETE(request) {
    try {
        const { studentId } = await request.json()
        await connectDB()
        await Student.findOneAndDelete({ studentId })
        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting student' }, { status: 500 })
    }
}
