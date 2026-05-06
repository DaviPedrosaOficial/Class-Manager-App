import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    matriz: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model("Institution", InstitutionSchema);