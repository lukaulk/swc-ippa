import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { accao, commits_id, tfc_id } = req.body;
        try {
            const estado = await prisma.estadoTFC.create({
                data: {
                    accao: String(accao),
                    commits_id: Number(commits_id),
                    tfc_id: Number(tfc_id)
                }
            });

            res.status(201).json({ success: true, data: estado });
        } catch (error) {
            console.error("Erro ao adicionar um novo estado do TFC\n", error);
            res.status(500).json({ success: false, error: "Erro ao adicionar um novo estado do TFC: \n", msgError: error });
        }
    } else if (req.method === 'GET') {
        const { tfc_id } = req.query;
        try {
            const estados = await prisma.estadoTFC.findMany({
                where: { tfc_id: Number(tfc_id) }
            });

            res.status(200).json({ success: true, data: estados });
        } catch (error) {
            console.error("Erro ao buscar estados do TFC\n", error);
            res.status(500).json({ success: false, error: "Erro ao buscar estados do TFC: \n", msgError: error });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
