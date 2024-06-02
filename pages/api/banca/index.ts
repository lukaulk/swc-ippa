import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../utils/prisma"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {
                titulo_id,
                data,
                hora_inicio,
                hora_fim,
                local,
                presidente,
                vogal1,
                vogal2,
                tfc_id,
                usuario_id
            } = req.body;

            const dados = await prisma.banca.create({
                data: {
                    titulo_id: Number(titulo_id),
                    data: new Date(data).toISOString(),
                    hora_inicio: hora_inicio,
                    hora_fim: hora_fim,
                    local,
                    presidente: Number(presidente),
                    vogal1: Number(vogal1),
                    vogal2: Number(vogal2),
                    tfc_id: Number(tfc_id),
                    usuario_id: Number(usuario_id)
                }
            });
            res.status(201).json({ dados, msg: "Sucesso no cadastro da banca!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar a banca', errorMSG: error });
        }
    } else if (req.method === 'GET') {
        try {
            const { uid } = req.query;
            const banca = await prisma.banca.findMany({
                where: { usuario_id: Number(uid) }
            });
            if (banca.length > 0) {
                res.status(200).json({ success: true, data: banca });
            } else {
                res.status(404).json({ success: false, error: "Nenhuma banca encontrada" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error finding banca' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
