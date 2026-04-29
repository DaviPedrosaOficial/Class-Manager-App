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
        const { nome, matricula } = req.body;

        if (!nome || !matricula) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        const newStudent = await Student.create({
            nome,
            matricula,
            classId: req.params.classId,
            grades: classData.atividades.map((atividade) => ({
                atividadeId: atividade._id,
                nota: 0
            }))
        });

        res.status(201).json(newStudent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar aluno" });
    }
};

export const updateStudentGrades = async (req, res) => {
    try {
        const { atividadeId, grades } = req.body;

        if (!atividadeId || !grades) {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        const students = await Student.find({ classId: req.params.classId });

        const classData = await Class.findById(req.params.classId);

        const atividade = classData.atividades.find(
            (a) => a._id.toString() === atividadeId
        );

        if (!atividade){
            return res.status(404).json({ message: "Atividade não encontrada" });
        }

        const max = atividade.peso;

        for (let student of students) {
            const value = grades[student._id.toString()];

            if (value > max){
                return res.status(400).json({
                    message: `Nota não pode ser maior que ${max}`
                });
            }

            if (value !== undefined) {
                const existing = student.grades.find(
                    (g) => g.atividadeId.toString() === atividadeId
                );

                if (existing) {
                    existing.nota = value;
                } else {
                    student.grades.push({
                        atividadeId,
                        nota: value
                    });
                }

                await student.save();
            }
        }

        const updatedStudents = await Student.find({ classId: req.params.classId });

        res.json(updatedStudents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar notas" });
    }
};