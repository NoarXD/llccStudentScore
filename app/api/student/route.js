import connectDB from "../../../lib/mongodb";
import Student from "../../../models/student";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const students = await Student.find();

        // สร้าง response พร้อม headers ป้องกัน cache
        const response = NextResponse.json(students);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}