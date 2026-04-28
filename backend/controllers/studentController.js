import Student from "../models/Student.js";

export const getStudentsByClassId = async (req, res) => {
    try {
        const students = await Student.find({ classId: req.params.classId });
        res.json(students);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar alunos" });
    }
};

export const createStudent = async (req, res) => {
    try {
        const { nome, matricula} = req.body;

        if (!nome || !matricula) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const newStudent = await Student.create({
            nome,
            matricula,
            classId: req.params.classId
        });

        res.status(201).json(newStudent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar aluno" });
    }
};