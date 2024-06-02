import {  object, string } from 'zod';

export const profSchema =  object({
    nome : string().min(5, {message: "O nome do Professor não pode estar vaziu!"}).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Nome do professor só pode conter letras" }),
})

export interface IprofFunc{
    createProf(nome: string, descricao: string, usuario_id: number) : Promise<any>
    findProf(uid: number): Promise<any>
}

export const profFunc = {
       async createProf(nome: string, descricao: string, usuario_id: number){
        try {
            const response = await fetch('api/prof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nome, descricao: descricao, usuario_id: usuario_id })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json()
        } catch (err) { console.log(err);  }
       },
       async findProf(uid: number){
        try {
            const response = await fetch(`api/prof?usuario_id=${Number(uid)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao buscar o professor');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Erro ao requisitar os professores' };
        }
       }
}
