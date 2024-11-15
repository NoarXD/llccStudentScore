import connectDB from "../../../lib/mongodb";
import Student from "../../../models/student";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const students = await Student.find();
        return NextResponse.json(students, { headers: { 'Cache-Control': 'no-cache, no-store' } });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}