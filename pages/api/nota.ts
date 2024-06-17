import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface CreateUserRequest {
  tfc_id: number;
  banca_id: number;
  valor: number;
}

interface FindUserRequest {
    banca_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { tfc_id, banca_id, valor }: CreateUserRequest = req.body;
        try {
            const dados = await prisma.nota.create({
                data: {
                    tfc_id, banca_id, valor
                }
            });
            res.status(201).json({ success: true, data: dados });
        } catch (error) {
            console.error("Erro ao add a nota:", error);
            res.status(500).json({ success: false, error: "Erro ao add a nota", msg: error });
        }
    } else if (req.method === 'GET') {
        const { banca_id } : FindUserRequest = req.query;
        try {
            const user = await prisma.nota.findFirst({
                where: {
                    banca_id: Number(banca_id)
                }
            }); 
            if (user) {
                res.status(200).json({ success: true, data: user });
            } else {
                res.status(404).json({ success: false, error: "Nota não encontrada" });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            res.status(500).json({ success: false, error: "Erro ao buscar a nota" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}