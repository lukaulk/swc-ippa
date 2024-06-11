import { object, string } from 'zod';

export const tfcSchema = object({
    titulo: string().min(5, { message: "O título do TFC não deve estar vazio ou ser tão curto" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ-0-9\s]+$/, { message: "O título do TFC só pode conter letras" }),
});

export interface ItfcFunc {
    findtfc(uid: number): Promise<any>;
    delete(uid: number): Promise<any>;
    findAllTFCs(): Promise<any>;
}

export const tfcFunc: ItfcFunc = {
    async delete(id: number) {
        try {
            const tfc = await fetch(`api/tfc/${Number(id)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!tfc.ok || tfc.status == 404) {
                throw new Error('Erro ao deletar o tfc');
            }
            return { success: true, id: id }
        } catch (error) {
            return { success: false, error: "Erro ao requisitar a remoção do tfc \n" + error }
        }
    },
    async findtfc(uid: number) {
        try {
            const response = await fetch(`api/tfc?usuario_id=${Number(uid)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao buscar o tfc');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Este usuário não existe' };
        }
    },
    async findAllTFCs() {
        try {
            const response = await fetch('api/tfc', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao buscar todos os tfcs');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Erro ao buscar todos os tfcs' };
        }
    }
}
