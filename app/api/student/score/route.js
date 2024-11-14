import Student from "../../../../models/student";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { studentId, term, reading, speaking, listening, grammar, tense, wordCombination, translation } = await req.json();

        if (!studentId || !term) {
            throw new Error("Student ID and term are required")
        }

        await connectDB();

        const student = await Student.findOne({ studentId });
        if (!student) {
            return NextResponse.json({
                message: "Student not found",
                status: 404
            });
        }

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

        const termKey = `term${term}`;
        student.scores[0][termKey].reading = reading;
        student.scores[0][termKey].speaking = speaking;
        student.scores[0][termKey].grammar = grammar;
        student.scores[0][termKey].wordCombination = wordCombination;
        student.scores[0][termKey].tense = tense;
        student.scores[0][termKey].listening = listening;
        student.scores[0][termKey].translation = translation;

        await student.save();

        return NextResponse.json({
            message: "Score updated successfully",
            status: 200
        });


    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json({
            message: "Error updating score",
            error: error.message,
            status: 500
        });
    }
}
