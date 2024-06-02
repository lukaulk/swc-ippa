import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../utils/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {    
const TFCId = req.query.id as string;
if (req.method === 'DELETE') {
try {
    const parsedTFCId = parseInt(TFCId, 10);
    
    if (isNaN(parsedTFCId)) {
        return res.status(400).json({ error: 'ID do TFC inválido' });
    }
    const deletedTFC = await prisma.tfc.delete({
        where: {
            id: parsedTFCId,
        },
    });

    if (deletedTFC) {
        return res.status(200).json({ success: true, data: deletedTFC });
    } else {
        return res.status(404).json({ error: 'TFC não encontrado' });
    }
} catch (error) {
    console.error('Erro ao deletar o TFC:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao deletar o curso' });
}
} else {
    return res.status(405).json({ error: 'Método não permitido' });
}
}