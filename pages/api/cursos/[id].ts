import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const courseId = req.query.id as string;

    if (req.method === 'DELETE') {
        try {
            const parsedCourseId = parseInt(courseId, 10);
            
            if (isNaN(parsedCourseId)) {
                return res.status(400).json({ error: 'ID do curso inválido' });
            }
            const deletedCourse = await prisma.curso.delete({
                where: {
                    id: parsedCourseId,
                },
            });

            if (deletedCourse) {
                return res.status(200).json({ success: true, data: deletedCourse });
            } else {
                return res.status(404).json({ error: 'Curso não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao deletar o curso:', error);
            return res.status(500).json({ error: 'Erro interno do servidor ao deletar o curso' });
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' });
    }
}
