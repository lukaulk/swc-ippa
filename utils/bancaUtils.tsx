// bancaUtils.ts
import {  object, string } from 'zod';

export const bancaSchema =  object({
 local : string().min(1, {message: "O local não pode estar vazio ou ser tão curto"}).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ-0-9\s]+$/, { message: "O Local da Defesa só pode conter letras e números" }),
})

export interface IBancaFunc {
    create(data: string, hora_inicio: string, hora_fim: string, local: string, presidente: number, vogal1: number, vogal2: number, tfc_id: number, usuario_id: number): Promise<any>;
    find(uid: number): Promise<any>;
}

export const BancaFunc: IBancaFunc = {
    async create(data, hora_inicio, hora_fim, local, presidente, vogal1, vogal2, tfc_id, usuario_id) {
        try {
            const response = await fetch('api/banca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: new Date(data).toISOString(), 
                    hora_inicio: hora_inicio,
                    hora_fim: hora_fim,
                    local,
                    presidente: Number(presidente),
                    vogal1: Number(vogal1),
                    vogal2: Number(vogal2),
                    tfc_id: Number(tfc_id),
                    usuario_id: Number(usuario_id)
                })
            });

            if (!response.ok || response.status === 404) {
                throw new Error('Erro ao cadastrar a Banca');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Erro ao fazer a requisição de uma nova banca: ${error}`);
        }
    },
    async find(uid) {
        try {
            const response = await fetch('api/banca?uid='+ uid, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok || response.status === 404) {
                throw new Error('Erro ao encontrar a Banca');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`\nError ao buscar a banca: ${error}`);
        }
    }
};
