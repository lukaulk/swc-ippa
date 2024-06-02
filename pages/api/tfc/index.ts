import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../utils/prisma";
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { titulo, dataEntrega, arquivo, aluno_id, orientador_id, usuario_id, observacoes } = req.body;

        if (!titulo || !dataEntrega || !arquivo || !aluno_id || !orientador_id || !usuario_id || !observacoes) {
            return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
        }

        const parsedDataEntrega = new Date(dataEntrega);
        if (isNaN(parsedDataEntrega.getTime())) {
            return res.status(400).json({ success: false, message: 'Data de entrega inválida.' });
        }

        try {
            const newTFC = await prisma.tfc.create({
                data: {
                    titulo,
                    data_entrega: parsedDataEntrega,
                    arquivo,
                    observacoes,
                    aluno_id : String(aluno_id),
                    orientador_id : String(orientador_id),
                    usuario_id,
                },
            });

            return res.status(201).json({ success: true, data: newTFC });
        } catch (error) {
            console.error('Erro ao criar novo TFC:', error);
            return res.status(500).json({ success: false, message: 'Erro ao criar novo TFC', error: String(error)});
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

                const tfc = await prisma.tfc.findMany({
                    where: { usuario_id: id }
                });

                if (tfc.length > 0) {
                    res.status(200).json({ success: true, data: tfc });
                } else {
                    res.status(404).json({ success: false, error: "TFC não encontrado" });
                }
            } catch (error) {
                console.error("Erro ao buscar os dados do TFC:", error);
                res.status(500).json({ success: false, error: "Erro ao buscar o TFC" });
            }
        } else {
            res.status(400).json({ success: false, error: "ID do usuário inválido" });
        } 
     } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
