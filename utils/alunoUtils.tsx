import { object, string } from 'zod';

export const alunoSchema = object({
    nome: string().min(5, { message: "O nome do aluno não pode estar vazio!" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Nome do aluno só pode conter letras" }),
    telefone: string().regex(/^9\d{8}$/, { message: "Insere um número de telemóvel válido, com 9 dígitos" }),
    bi: string().regex(/^00\d{5}[A-Z]{2}\d{3}$/, { message: "O Bilhete de Identidade deve seguir o formato: 00XXXXXYYZZZ (onde X é dígito, Y é letra maiúscula, e Z é dígito)." })
});

export const alunoLoginSchema = object({
    telefone: string().regex(/^9\d{8}$/, { message: "Insere um número de telemóvel válido, com 9 dígitos" }),
    bi: string().regex(/^00\d{5}[A-Z]{2}\d{3}$/, { message: "O Bilhete de Identidade deve seguir o formato: 00XXXXXYYZZZ (onde X é dígito, Y é letra maiúscula, e Z é dígito)." })
});

export interface IalunoFunc {
    createAluno(nome: string, curso_id: number, telefone: number, bi: string, usuario_id: number): Promise<any>;
    findAluno(uid: number): Promise<any>;
    findAlunoLogin(telefone: number, bi: string): Promise<any>;
    updateAluno(id: number, nome: string, curso_id: number, telefone: number, bi: string, usuario_id: number): Promise<any>;
}

export const alunoFunc: IalunoFunc = {
    async createAluno(nome, curso_id, telefone, bi, usuario_id) {
        try {
            const response = await fetch('api/alunos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, curso_id, telefone, bi, usuario_id })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    },
    async findAluno(uid: number) {
        try {
            const response = await fetch(`api/alunos?usuario_id=${uid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok || response.status === 404) {
                throw new Error('Erro ao buscar o aluno, aluno não encontrado!');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return { success: false, error: 'Falha na requisição dos alunos\n' };
        }
    },
    async findAlunoLogin(telefone, bi) {
        try {
            console.log(`telefone: ${telefone}\nbi: ${bi}`);
            const response = await fetch(`api/alunos/login?telefone=${telefone}&bi=${bi}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok || response.status === 404) {
                throw new Error('Erro ao buscar o aluno, aluno não encontrado!');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return { success: false, error: 'Falha na requisição dos alunos\n' + error };
        }
    },
    async updateAluno(id, nome, curso_id, telefone, bi, usuario_id) {
        try {
            const response = await fetch(`api/alunos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, curso_id, telefone, bi, usuario_id })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    }
};
