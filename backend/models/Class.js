import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    atividades: [{ nomeAtividade: String, peso: Number }],
    mediaMinima: {type: Number, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createAt: { type: Date, default: Date.now }
});

export default mongoose.model("Class", ClassSchema);