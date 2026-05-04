import Institution from "../models/Institution.js";

export const getInstitution = async (req, res) => {
    try {
        const institutions = await Institution.find({
            userId: req.user.userId
        });

        res.json(institutions)
    } catch (error){
        res.status(500).json({ message: ` Erro ao buscar as instituições. Erro: ${error} ` });
    }
};

export const createInstitution =  async (req, res) => {
    try {
        const { nome } = req.body;

        const institution = await Institution.create({
            nome,
            userId: req.user.userId
        });

        res.status(201).json(institution);
    } catch (error){
        res.status(500).json({ message: `Erro ao criar a instituição. Error: ${error} ` })
    }
};