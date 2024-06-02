import {  object, string } from 'zod';

export const cursoSchema =  object({
    nome : string().min(1, {message: "O nome do curso não pode estar vaziu!"}).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Nome do curso só pode conter letras" })
})


export interface ICursoFunctions {
    createCurso(nome: string, descricao: string, id_login: number): Promise<any>;
    findCurso(uid: string): Promise<any>;
    editCurso(id: number): Promise<any>;
    deleteCurso(id: number): Promise<any>;

}

export const cursoFunctions: ICursoFunctions = {
      async  createCurso(nome, descricao, id_login) {
        try {
            const response = await fetch('api/cursos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nome, descricao: descricao, usuario_id: id_login   })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (err) { console.log(err);  }
        return { nome, descricao };
    },
    async findCurso(uid) {
        try {
            const response = await fetch(`api/cursos?usuario_id=${uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao buscar o usuário');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Este usuário não existe' };
        } 
    },
    async editCurso(id) {
        try {
            const response = await fetch(`api/cursos?usuario_id=${id}`, {
                method: 'UPDATE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok || response.status == 404) {
                throw new Error('Erro ao editar o curso, não foi encontrado!');
            }
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Este curso não existe' };
        } 
    },
    async deleteCurso(id) {
        try {
            const response = await fetch(`api/cursos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok || response.status === 404) {
                throw new Error('Erro ao eliminar o curso, não foi encontrado!');
            }
    
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Este curso não existe' };
        } 
    }
};