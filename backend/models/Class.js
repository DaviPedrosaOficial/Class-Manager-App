import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
    materia: { type: String, required: true },
    nomeTurma: { type: String, required: true },
    turno: { type: String, required: true },

    atividades: [{ nomeAtividade: String, peso: Number }],
    mediaMinima: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true },
    
    createAt: { type: Date, default: Date.now }
});

export default mongoose.model("Class", ClassSchema);