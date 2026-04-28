import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: String, required: true },
    notas: [{ nomeAtividade: String, nota: Number }],
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }
});

export default mongoose.model("Student", StudentSchema);