import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            return createProfessor(req, res);
        case 'GET':
            return getProfessors(req, res);
        case 'PUT':
            return updateProfessor(req, res);
        case 'DELETE':
            return deleteProfessor(req, res);
        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Método ${method} não permitido`);
    }
}

async function createProfessor(req: NextApiRequest, res: NextApiResponse) {
    const { nome, descricao, senha, coordenador, orientador, banca, usuario_id } = req.body;

    try {
        const newProf = await prisma.professor.create({
            data: {
                nome,
                descricao,
                senha,
                coordenador,
                orientador,
                banca,
                usuario_id,
            },
        });

        res.status(201).json({ success: true, data: newProf });
    } catch (error) {
        console.error('Erro ao adicionar um novo professor', error);
        res.status(500).json({ success: false, error: 'Erro ao adicionar um novo professor' });
    }
}

async function getProfessors(req: NextApiRequest, res: NextApiResponse) {
    const { usuario_id } = req.query;

    if (typeof usuario_id === 'string') {
        try {
            const id = parseInt(usuario_id, 10);

            if (isNaN(id)) {
                res.status(400).json({ success: false, error: 'ID do usuário inválido' });
                return;
            }

            const prof = await prisma.professor.findMany({
                where: { usuario_id: id },
            });

            if (prof.length > 0) {
                res.status(200).json({ success: true, data: prof });
            } else {
                res.status(404).json({ success: false, error: 'Professor não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao buscar os professores:', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar os professores' });
        }
    } else {
        res.status(400).json({ success: false, error: 'ID do usuário inválido' });
    }
}

async function updateProfessor(req: NextApiRequest, res: NextApiResponse) {
    const { id, nome, descricao, senha, coordenador, orientador, banca } = req.body;

    try {
        const updatedProf = await prisma.professor.update({
            where: { id },
            data: {
                nome,
                descricao,
                senha,
                coordenador,
                orientador,
                banca,
            },
        });

        res.status(200).json({ success: true, data: updatedProf });
    } catch (error) {
        console.error('Erro ao atualizar o professor', error);
        res.status(500).json({ success: false, error: 'Erro ao atualizar o professor' });
    }
}

async function deleteProfessor(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;

    try {
        await prisma.professor.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: 'Professor deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar o professor', error);
        res.status(500).json({ success: false, error: 'Erro ao deletar o professor' });
    }
}
