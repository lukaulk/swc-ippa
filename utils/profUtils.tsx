import { object, string, boolean, number } from 'zod';

export const profSchema = object({
  nome: string().min(5, { message: "O nome do Professor não pode estar vazio!" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: "Nome do professor só pode conter letras" }),
  descricao: string(),
  senha: string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  coordenador: boolean(),
  orientador: boolean(),
  banca: boolean(),
  usuario_id: number(),
});

export interface IprofFunc {
  createProf(data: any): Promise<any>
  updateProf(id: number, data: any): Promise<any>
  findProf(uid: number): Promise<any>
}

export const profFunc = {
  async createProf(data: any) {
    try {
      const response = await fetch('api/prof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  async updateProf(id: number, data: any) {
    try {
      const response = await fetch(`api/prof/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  async findProf(uid: number) {
    try {
      const response = await fetch(`api/prof?usuario_id=${Number(uid)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok || response.status == 404) {
        throw new Error('Erro ao buscar o professor');
      }
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Erro ao requisitar os professores' };
    }
  },
}
