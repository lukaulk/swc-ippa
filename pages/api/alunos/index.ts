import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nome, curso_id, telefone, bi, usuario_id } = req.body;
        try {
            const newAluno = await prisma.aluno.create({
                data: {
                    nome,
                    curso_id,
                    telefone,
                    bi,
                    usuario_id
                }
            });

            res.status(201).json({ success: true, data: newAluno });
        } catch (err) {
            console.error("Erro ao adicionar um novo aluno!", err);
            res.status(500).json({ success: false, error: "Erro na criação de um novo aluno" });
        }
    } else if (req.method === 'GET') {
        const { usuario_id } = req.query;

        if (typeof usuario_id === 'string') {
            try {
                const id = parseInt(usuario_id, 10);

                if (isNaN(id)) {
                    res.status(400).json({ success: false, error: "ID do usuário inválido" });
                    return;
                }

                const aluno = await prisma.aluno.findMany({
                    where: { usuario_id: id }
                });

                if (aluno.length > 0) {
                    res.status(200).json({ success: true, data: aluno });
                } else {
                    res.status(404).json({ success: false, error: "Aluno não encontrado" });
                }
            } catch (error) {
                console.error("Erro ao buscar os dados do aluno:", error);
                res.status(500).json({ success: false, error: "Erro ao buscar o aluno" });
            }
        } else {
            res.status(400).json({ success: false, error: "ID do usuário inválido" });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (typeof id === 'string') {
            try {
                const alunoId = parseInt(id, 10);

                if (isNaN(alunoId)) {
                    res.status(400).json({ success: false, error: "ID do aluno inválido" });
                    return;
                }

                await prisma.aluno.delete({
                    where: { id: alunoId }
                });

                res.status(200).json({ success: true });
            } catch (error) {
                console.error("Erro ao deletar o aluno:", error);
                res.status(500).json({ success: false, error: "Erro ao deletar o aluno" });
            }
        } else {
            res.status(400).json({ success: false, error: "ID do aluno inválido" });
        }
    
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
