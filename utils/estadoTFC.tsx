import { z } from 'zod'

export const estadoSchema = z.object({
    accao: z.string().min(2, { message: "A ação deve conter pelo menos 2 caracteres" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Apenas são aceitas letras e espaços" }),
    commits_id: z.number().nonnegative({ message: "O ID do commit deve ser um número não negativo" }),
    tfc_id: z.number().nonnegative({ message: "O ID do TFC deve ser um número não negativo" })
});

interface IEstados {
    create(accao: string, commits_id: number, tfc_id: number): Promise<any>;
    find(tfc_id: number): Promise<any>;
}

export const EstadosFunc: IEstados = {
    async create(accao, commits_id, tfc_id) {
        try {
            const response = await fetch('api/estadoTFC', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accao, commits_id, tfc_id })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (err) {
            console.log("Erro ao salvar novo estado do TFC:\n" + err);
            return { success: false, error: 'Erro de requisição ' + err };
        }
    },
    async find(tfc_id) {
        try {
            const response = await fetch('api/estadoTFC?tfc_id=' + tfc_id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (err) {
            console.log("Erro ao buscar estados do TFC:\n" + err);
            return { success: false, error: 'Erro de requisição ' + err };
        }
    }
}
