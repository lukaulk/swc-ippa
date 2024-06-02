import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nome, descricao, usuario_id } = req.body;
        try {
            const newProf = await prisma.professor.create({
            data: {
                nome, 
                descricao, 
                usuario_id
            }
            });

            res.status(201).json({ success: true, data: newProf });
        } catch (error) {
            console.error("Erro ao adicionar um novo professor", error);
            res.status(500).json({ success: false, error: "Erro ao adicionar um novo professor" });
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

                const prof = await prisma.professor.findMany({
                    where: { usuario_id: id }
                });
    
                if (prof.length > 0) {
                    res.status(200).json({ success: true, data: prof });
                } else {
                    res.status(404).json({ success: false, error: "Professor não encontrado" });
                }
            } catch (error) {
                console.error("Erro ao buscar o professor:", error);
                res.status(500).json({ success: false, error: "Erro ao buscar o professor" });
            }
        } else {
            res.status(400).json({ success: false, error: "ID do usuário inválido" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
