import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id } = req.query
        const { nome, curso_id, telefone, bi } = req.body;

        console.log(id)
        try {
            const updatedAluno = await prisma.aluno.update({
                where: { id: Number(id) },
                data: { nome, curso_id, telefone, bi }
            });

            res.status(200).json({ success: true, data: updatedAluno });
        } catch (error) {
            console.error("Erro ao atualizar o aluno:", error);
            res.status(500).json({ success: false, error: "Erro ao atualizar o aluno" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
