import { z } from 'zod';

export const commitSchema = z.object({
    mensagem: z.string().min(3, { message: "O campo deve conter pelo menos 3 caracteres" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Apenas são aceitas letras e espaços" })
});

interface ICommits {
    create(message: string, timestamp: string, uid: number): Promise<any>;
    find(uid: number): Promise<any>;
}

export const CommitsFunc: ICommits = {
    async create(message, timestamp, uid) {
        try {
            const validationResult = commitSchema.safeParse({ mensagem: message, timestamp, uid });
            if (!validationResult.success) {
                throw new Error(validationResult.error.errors.map(e => e.message).join(', '));
            }

            const response = await fetch('api/commits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, timestamp, uid })
            });
            
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (err) {
            console.log("Erro ao salvar nova submissão:\n" + err);
            return { success: false, error: 'Erro de requisição ' + err };
        }
    },
    async find(uid) {
        try {
            const response = await fetch(`api/commits?uid=${uid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (err) {
            console.log("Erro ao buscar commits:\n" + err);
            return { success: false, error: 'Erro de requisição ' + err };
        }
    }
}
