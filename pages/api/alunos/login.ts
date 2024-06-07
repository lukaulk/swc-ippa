import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method === 'GET') { 
    const { telefone, bi } = req.query;
    try {
        const user = await prisma.aluno.findFirst({
            where: {
                telefone: Number(telefone),
                bi: String(bi)
            }
        }); 
        
        if (user) {
            res.status(200).json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, error: "Usuário (Aluno) não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar usuário: \n", error);
        res.status(500).json({ success: false, error: "Erro ao buscar usuário" });
    }
}
}