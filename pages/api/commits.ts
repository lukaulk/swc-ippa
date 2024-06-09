import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { message, timestamp, uid } = req.body;
        
        if (!message || !timestamp || !uid) {
            res.status(400).json({ success: false, error: "Todos os campos são obrigatórios" });
            return;
        }

        try {
            const commit = await prisma.commits.create({
                data: {
                    mensagem: String(message),
                    timestamp: String(timestamp),
                    aluno_id: Number(uid),
                },
            });

            res.status(201).json({ success: true, data: commit });
        } catch (error) {
            console.error("Erro ao adicionar um novo commit\n", error);
            res.status(500).json({ success: false, error: "Erro ao adicionar um novo commit", msgError: error });
        }
    } else if (req.method === 'GET') {
        const { uid } = req.query;
        
        if (typeof uid !== 'string') {
            res.status(400).json({ success: false, error: "ID do usuário inválido" });
            return;
        }

        try {
            const id = parseInt(uid, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, error: "ID do usuário inválido" });
                return;
            }

            const commits = await prisma.commits.findMany({
                where: { aluno_id: id },
            });

            if (commits.length > 0) {
                res.status(200).json({ success: true, data: commits });
            } else {
                res.status(404).json({ success: false, error: "Commits não encontrados" });
            }
        } catch (error) {
            console.error("Erro ao buscar os commits: ", error);
            res.status(500).json({ success: false, error: "Erro ao buscar os commits" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}
