import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const profId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);

    if (isNaN(profId)) {
        res.status(400).json({ success: false, error: "ID inválido" });
        return;
    }

    if (req.method === 'PUT') {
        const { nome, descricao, senha, coordenador, orientador, banca } = req.body;
        try {
            const updatedProf = await prisma.professor.update({
                where: { id: profId },
                data: { nome, descricao, senha, coordenador, orientador, banca }
            });

            res.status(200).json({ success: true, data: updatedProf });
        } catch (error) {
            console.error("Erro ao atualizar o professor", error);
            res.status(500).json({ success: false, error: "Erro ao atualizar o professor" });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.professor.delete({
                where: { id: profId },
            });

            res.status(204).end();
        } catch (error) {
            console.error("Erro ao deletar o professor", error);
            res.status(500).json({ success: false, error: "Erro ao deletar o professor" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
