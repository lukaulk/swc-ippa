import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { usuario, senha, categoria, usuario_id } = req.body;
        try {
            const newTeam = await prisma.team.create({
                data: {
                    usuario, senha, categoria, usuario_id
                }
            });

            res.status(201).json({ success: true, data: newTeam });
        } catch (err) {
            console.error("Erro ao adicionar um novo team! \n" +  err);
            res.status(500).json({ success: false, error: "Erro na criação de um novo team" });
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

                const team = await prisma.team.findMany({
                    where: { usuario_id: id }
                });

                if (team.length > 0) {
                    res.status(200).json({ success: true, data: team });
                } else {
                    res.status(404).json({ success: false, error: "Team não encontrado" });
                }
            } catch (error) {
                console.error("Erro ao buscar os dados do team:", error);
                res.status(500).json({ success: false, error: "Erro ao buscar o team" });
            }
        } else {
            res.status(400).json({ success: false, error: "ID do usuário inválido" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
