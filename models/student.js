import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    nameEng: {
        type: String,
        required: true,
    },
    nameLao: {
        type: String,
        required: true,
    },
    gen: {
        type: Number,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    scores: [{
        reading: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        speaking: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        listening: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        grammar: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        tense: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        translation: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
        wordCombination: [{
            term1: { type: Number },
            term2: { type: Number },
            term3: { type: Number },
            term4: { type: Number },
            term5: { type: Number },
            term6: { type: Number },
        }],
    }]
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;