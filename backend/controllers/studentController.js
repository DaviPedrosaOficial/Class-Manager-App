import Student from "../models/Student.js";
import Class from "../models/Class.js";

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

        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        const notas = classData.atividades.map((atividade) => ({ nomeAtividade: atividade.nomeAtividade, nota: 0 }));

        const newStudent = await Student.create({
            nome,
            matricula,
            classId: req.params.classId,
            notas
        });

        res.status(201).json(newStudent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar aluno" });
    }
};