import {  object, string } from 'zod';

export const teamSchema = object({
    usuario: string().min(5, { message: "O nome do usuario não deve estar vazio ou ser tão curto" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "O nome do usuário só pode conter letras" }),
    senha: string().min(6, { message: "Senha deve conter pelo menos 6 caracteres" }),
    categoria: string().nonempty({ message: "Categoria não pode estar vazia" })
});


export interface IteamFunc{
    createTeam(usuario: string, senha: string, categoria: string, usuario_id: number) : Promise<any>
    findTeam(uid: number): Promise<any>
}

export const teamFunc = {
       async createTeam(usuario: string, senha: string, categoria: string, usuario_id: number){
        try {
            const response = await fetch('api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario, senha: senha, categoria: categoria, usuario_id: usuario_id })
            });
            console.log(response)
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json()
        } catch (err) { console.log(err);  }
       },
       async editTeam(usuario: string, senha: string){
        try {
            const response = await fetch('api/team', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario, senha: senha })
            });
            console.log(response)
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            return await response.json()
        } catch (err) { console.log(err);  }
       },
       async findTeam(uid: number){
        try {
            const response = await fetch(`api/team?usuario_id=${Number(uid)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao buscar o TEAM');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Este usuário não existe' };
        }
       }
}
