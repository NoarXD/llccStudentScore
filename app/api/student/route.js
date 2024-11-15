import connectDB from "../../../lib/mongodb";
import Student from "../../../models/student";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req) {
    try {
        await connectDB();
        const students = await Student.find();
        revalidatePath("/")
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}