import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Interface para os dados da solicitação de criação de usuário
interface CreateUserRequest {
    usuario: string;
    senha: string;
    email: string;
    categoria: string;
}

interface FindUserRequest {
    usuario: string;
    senha: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { usuario, senha, email, categoria }: CreateUserRequest = req.body;
        try {
            const newUser = await prisma.login.create({
                data: {
                    usuario,
                    senha,
                    email,
                    categoria
                }
            });
            res.status(201).json({ success: true, data: newUser });
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json({ success: false, error: "Erro ao criar usuário" });
        }
    } else if (req.method === 'GET') {
        const { usuario, senha } = req.query;
        try {
            const user = await prisma.login.findFirst({
                where: {
                    usuario: usuario as string,
                    senha: senha as string
                }
            }); 
            if (user) {
                res.status(200).json({ success: true, data: user });
            } else {
                res.status(404).json({ success: false, error: "Usuário não encontrado" });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            res.status(500).json({ success: false, error: "Erro ao buscar usuário" });
        }
    } else {
        res.status(405).json({ success: false, error: "Método não permitido" });
    }
}