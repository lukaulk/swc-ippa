import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const {usuario, senha} = req.query.id as string;

    // if (req.method === 'PUT') {
    //     try {
    //         const deletedCourse = await prisma.team.delete({
    //             where: {
    //                 usuario: 
    //             },
    //         });

    //         if (deletedCourse) {
    //             return res.status(200).json({ success: true, data: deletedCourse });
    //         } else {
    //             return res.status(404).json({ error: 'Curso não encontrado' });
    //         }
    //     } catch (error) {
    //         console.error('Erro ao deletar o curso:', error);
    //         return res.status(500).json({ error: 'Erro interno do servidor ao deletar o curso' });
    //     }
    // } else {
    //     return res.status(405).json({ error: 'Método não permitido' });
    // }
}
