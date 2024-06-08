import { z } from 'zod'

export const commitSchema = z.object({
    mensagem : z.string().min(2, { message : "O campo não pode estar vaziu, ou deve conter pelomentos mais de 3 caracteres" }).regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message : "Apenas é aceite letras e números"})
})

interface ICommits{
    create(message: string, timestamp: string, uid: number): Promise<any>;
    find(uid: number): Promise<any>;
}
export const CommitsFunc = {
       async create(message: string, timestamp: string, uid: number){
            try{
                const response = await fetch('api/commits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({  message, timestamp, uid })
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }                
                return await response.json()
            } catch (err){
                console.log("Erro ao salvar nova submisão:\n" + err)
            return { success: false, error: 'Erro de requisição ' + err };

            }
       },
       async find(uid: number){
        try{
            const response = await fetch('api/commits?uid' + uid, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }                
            return await response.json()
        } catch (err){
            console.log("Erro ao salvar nova submisão:\n" + err)
            return { success: false, error: 'Este usuário não existe' };
        }
       }
}
