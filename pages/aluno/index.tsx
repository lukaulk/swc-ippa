import * as React from "react"
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useSession, startSession } from '../../utils/loginAuth';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { IconAlertTriangle } from "@tabler/icons-react";
import "@/app/globals.css"
import { alunoLoginSchema, alunoFunc } from "../../utils/alunoUtils"
const Login = () => {
    const router = useRouter()
    const session = useSession()

    const [msg, setMsg] = useState({ message: '' })
    const [loginData, setLoginData] = useState({ telefone: '', bi: '' });
    const [error, setError] = useState("");

    const useLogin = async () => {
        try {
            alunoLoginSchema.parse(loginData);
            const data = await alunoFunc.findAlunoLogin(Number(loginData.telefone), String( loginData.bi ))
            console.log(data)
            if (data.sucess === false || data.error) {
                console.log(data.error)
                setError(data.error)
            }
            startSession(data.data.nome, 'aluno', data.data.id) 
                ? router.push("cursos/#session_started") 
                : router.push("login/#session_error") 
        } catch (error: any) {
            console.log(error.message);
            console.log(error.errors);

            try {
                setError(JSON.parse(error)[0].message)
            } catch (err) {
                console.log(error)
            }
        }
    }

    // useEffect(() => {
    //     if (session.sucess === true) {
    //         // router.push("cursos/#session_started")
    //     } else {
    //        console.log("Erro ao iniciar a sessão automáticamente")
    //     }
    // }, [session, router]);

    const LoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await useLogin()
    };

    const inputMudado_Login = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    };
    return (
        <div className="w-full flex items-center justify-center absolute h-screen shadow-lg bg-zinc-50">
            {/* <img  src={"/assets/female.gif"} alt="Female" className="fixed left-0 bottom-0 w-[300px]" /> */}
            <img  src={"/assets/image.png"} alt="Image" className="fixed right-[-20px] bottom-[-40px] w-[300px]" />

            <div>
                {error.trim() !== "" ? (
                    <Alert className="mb-4  w-full max-w-[350px] text-red-700">
                        <IconAlertTriangle className="w-4 h-4" />
                        <AlertDescription className="font-semibold">
                            {error}
                        </AlertDescription>
                    </Alert>
                ) : (<div className="w-full flex justify-center items-center text-xl font-semibold mb-4">Bem-Vindo Aluno!</div>)}

                <Tabs defaultValue="login">
                    <TabsContent value="login" className="w-full">
                        <Card className="w-[350px] bg-gray-50 rounded-md">
                            <CardHeader className="mb-4 text-center flex items-center">
                                <CardTitle className="flex items-center gap-2">
                                    Login <span className="text-zinc-300 font-thin -top-1 relative">|</span> <span className="text-md text-zinc-400">SC-IPPA</span></CardTitle>
                                <br />
                                <CardDescription className="text-gray-600">Acessar a sua conta</CardDescription>
                                <Separator className="my-4" />
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={LoginSubmit}>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="telefone" className="mb-2">Número de Telefone</Label>
                                            <Input type="text" id="telefone" placeholder="ex: 900 000 000" className="border border-gray-400 rounded-md " value={loginData.telefone} onChange={inputMudado_Login} />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="bi" className="mb-2">Bilhe de identidade</Label>
                                            <Input type="text" id="bi" placeholder="Digite o número o ID do BI" className="border border-gray-400 rounded-md " value={loginData.bi} onChange={inputMudado_Login} />
                                        </div>
                                    </div>
                                    <Button type="submit" className="bg-violet-800 mb-2 mt-6 text-white hover:bg-blue-700 rounded-md w-full">Acessar Conta</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <span className="text-gray-800 py-2 font-semibold text-sm w-[350px] cursor-pointer bg-gray-50 border border-gray-100" onClick={() =>{
                                router.push('login/')
                            }}>Administre a sua instituição, <span className="text-violet-600">Clique aqui para começar</span></span>
            </div>
        </div>
    );
};
export default Login;