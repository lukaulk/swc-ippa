import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Nav from '@/components/myui/Nav';
import Header from "@/components/myui/Header"
import "@/app/globals.css"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconArrowRight } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "../utils/loginAuth"
import { CommitsFunc, commitSchema } from "../utils/commits"
import { EstadosFunc } from "../utils/estadoTFC"
import { useRouter } from 'next/navigation'
import {  tfcFunc } from "../utils/tfcUtils";

export default function Commits() {
    
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;
    
    const router = useRouter();
    const [commits, setCommits] = useState([]);
    const [formState, setFormState] = useState({ mensagem: "", accao: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tfc, setTFC] = useState([])
    useEffect(() => {
        const fetchCommits = async () => {
            setLoading(true);
            const response = await CommitsFunc.find(uid);
            if (response.success) {
                setCommits(response.data);
            } else {
                // setError(response.error);
                console.log(response.error)
            }
            setLoading(false);
        };
        fetchCommits();
    }, [uid]);

    useEffect(() => {
        const findTFC = async () => {
            try {
                const data = await tfcFunc.findAllTFCs();
                if (data.success === false) {
                    setError(data.error);
                } else {
                    console.log(uid)
                    console.log(data.data)
                    const id = data.data.find((e:any) =>{
                            const aluno = JSON.parse(e.aluno_id)

                            console.log(aluno)
                            console.log('Mapeado: \n' + uid == aluno.map((i:any) => {
                                return i
                            }))
                            return uid == aluno.map((i:any) => i)
                    })?.id
                    console.log(id)
                    setTFC(data.data);
                }
            } catch (err) {
                // setError(String(err) || "Erro na requisição dos dados");
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        findTFC();
    }, [uid]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitCommit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            commitSchema.parse(formState);

            const response = await CommitsFunc.create(formState.mensagem, new Date().toISOString().slice(0, 10), uid);
            if (response.success) {
                // const estadoResponse = await EstadosFunc.create(formState.accao, response.data.id,  1); // Ajuste o tfc_id conforme necessário
                // if (estadoResponse.success) {
                //     router.refresh();
                //     alert('Foi cadastrado uma nova submissão do commit e estado');
                // } else {
                //     setError(estadoResponse.error);
                //     console.log(estadoResponse.error);
                // }
                router.refresh();
                alert('Foi cadastrado uma nova submissão do commit e estado');
            } else {
                setError(response.error);
                console.log(response.error);
            }
        } catch (err: any) {
            console.log(err);
            setError(err.errors[0].message);
        }
    };

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 relative flex flex-col h-screen bg-gray-100">
                <Header content="Submissões e Estados do TFC" />
                <section className="w-full  max-w-[1200px] bg-gray-50  mt-1 h-screen text-gray-950  headerBorder">
                    <div className="flex justify-between absolute bottom-0">
                        <div className="flex mt-4 ml-6 gap-2">
                            <form onSubmit={submitCommit}>
                                <Input
                                    type="text"
                                    name="mensagem"
                                    value={formState.mensagem}
                                    onChange={handleInputChange}
                                    placeholder="Escreva uma mensagem do estado atual do TFC"
                                    className="w-[400px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200"
                                />
                                <select
                                    name="accao"
                                    value={formState.accao}
                                    onChange={handleInputChange}
                                    className='text-center text-sm font-semibold px-2 py-0 outline-none focus:outline-none hover:outline-none'
                                >
                                    <option value="">Selecione uma ação</option>
                                    <option value="Modificando">Modificando</option>
                                    <option value="Retificando">Retificando</option>
                                    <option value="Investigando">Investigando</option>
                                    <option value="Desenvolvendo">Desenvolvendo</option>
                                </select>
                                <Button type="submit" className="mb-2 text-green-50 hover:bg-green-500 active:bg-green-400 bg-green-600">
                                    <IconArrowRight stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Publicar Submissão
                                </Button>
                            </form>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        <br/><br/>
                        {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error ? (
                            <div className="w-full text-gray-700 font-semibold text-center">Nenhuma submissão encontrado, cadastre um!</div>
                        ) : (
                            <Table>
                                <TableCaption>Listagem das submissões do TFC feitas</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Submissões</TableHead>
                                        <TableHead>Submetido em</TableHead>
                                        <TableHead className="text-right">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="w-full">
                                    {commits.map((commit: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold">{index + 1}</TableCell>
                                            <TableCell>{commit.mensagem}</TableCell>
                                            <TableCell>{commit.timestamp}</TableCell>
                                            <TableCell className="text-right">{commit.accao}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </section>
            </div>
        </div>
    );
}
