import Admin from "@/models/admin";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        await connectDB();
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return NextResponse.json({ message: "Admin not found" }, { status: 404 });
        }
        const comparePassword = await bcrypt.compare(password, admin.password);

        return NextResponse.json({ comparePassword }, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin:", error);
        return NextResponse.json({ message: "Error fetching admin", error: error.message }, { status: 500 });
    }
}

