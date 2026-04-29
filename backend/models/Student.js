import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: String, required: true },

    grades: [
        {
            atividadeId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            nota: {
                type: Number,
                default: 0
            }
        }
    ],

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    }
});

export default mongoose.model("Student", StudentSchema);