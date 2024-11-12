import Student from "../../../../models/student";
import connectDB from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { studentId, term, reading, speaking, listening, grammar, tense, wordComb, translation } = await req.json();
        
        if (!studentId || !term) {
            return NextResponse.json({ 
                message: "Student ID and term are required",
                status: 400 
            });
        }

        await connectDB();

        const student = await Student.findOne({ studentId });
        if (!student) {
            return NextResponse.json({ 
                message: "Student not found", 
                status: 404 
            });
        }

        // Initialize scores array if it doesn't exist
        if (!student.scores || !student.scores.length) {
            student.scores = [{
                reading: [{}],
                speaking: [{}], 
                listening: [{}],
                grammar: [{}],
                tense: [{}],
                translation: [{}],
                wordCombination: [{}]
            }];
        }

        // Validate term is between 1-6
        const termNum = parseInt(term);
        if (isNaN(termNum) || termNum < 1 || termNum > 6) {
            return NextResponse.json({
                message: "Term must be between 1 and 6",
                status: 400
            });
        }

        // Validate score values are between 0-100
        const scores = {reading, speaking, listening, grammar, tense, translation, wordComb};
        for (const [key, value] of Object.entries(scores)) {
            if (value !== undefined) {
                const score = parseInt(value);
                if (isNaN(score) || score < 0 || score > 100) {
                    return NextResponse.json({
                        message: `${key} score must be between 0 and 100`,
                        status: 400
                    });
                }
            }
        }

        const termKey = `term${term}`;

        // Update each score category if provided
        if (reading !== undefined) {
            student.scores[0].reading[0][termKey] = parseInt(reading);
        }
        
        if (speaking !== undefined) {
            student.scores[0].speaking[0][termKey] = parseInt(speaking);
        }

        if (listening !== undefined) {
            student.scores[0].listening[0][termKey] = parseInt(listening);
        }

        if (grammar !== undefined) {
            student.scores[0].grammar[0][termKey] = parseInt(grammar);
        }

        if (tense !== undefined) {
            student.scores[0].tense[0][termKey] = parseInt(tense);
        }

        if (translation !== undefined) {
            student.scores[0].translation[0][termKey] = parseInt(translation);
        }

        if (wordComb !== undefined) {
            student.scores[0].wordCombination[0][termKey] = parseInt(wordComb);
        }

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
