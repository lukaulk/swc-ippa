import * as z from 'zod';

export const profSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    coordenador: z.boolean(),
    orientador: z.boolean(),
    banca: z.boolean()
});

const apiBaseUrl = '/api/prof';

export const profFunc = {
    createProf: async (nome: string, descricao: string, senha: string, coordenador: boolean, orientador: boolean, banca: boolean, usuario_id: number) => {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao, senha, coordenador, orientador, banca, usuario_id }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar professor');
        }

        return data;
    },

    findProf: async (usuario_id: number) => {
        const response = await fetch(`${apiBaseUrl}?usuario_id=${usuario_id}`);

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar professores');
        }

        return data;
    },

    updateProf: async (id: number, profData: any) => {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar professor');
        }

        return data;
    },

    deleteProf: async (id: number) => {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao deletar professor');
        }

        return data;
    },
};
