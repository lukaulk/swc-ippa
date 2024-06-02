import Nav from '@/components/myui/Nav'
import "@/app/globals.css"
import Header from "@/components/myui/Header"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { IconCursorText, IconDots, IconPlus, IconSearch, IconX } from "@tabler/icons-react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label }  from "@/components/ui/label"
import { useSession } from "../utils/loginAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { profSchema, profFunc } from "../utils/profUtils";
import AutoCloseAlert from "@/components/myui/AutoCloseAlert"

export default function Orientadores() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState({ msg: "" });
    const [dadosProf, setDadosProf] = useState({ nome: "", descricao : ""});
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorCrs, setErrorCrs] = useState("");
    const [prof, setProfs] = useState<any[]>([])

    useEffect(() => {
        const fetchProf = async () => {
            try {
                const data = await profFunc.findProf(uid);
                if (data.success === false) {
                    setErrorCrs(String(data.error));
                    console.log("Erro ao buscar os professores!");
                } else {
                    setProfs(data.data);
                }
            } catch (err) {
                console.log(err);
                setErrorCrs(String(err));
            } finally {
                setLoading(false);
            }
        };
        fetchProf();
    }, [uid]);

    const profMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setDadosProf({ ...dadosProf, [e.target.name]: e.target.value });
    };

    const profSubmit =  async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            profSchema.parse(dadosProf);
            const dados = await profFunc.createProf(dadosProf.nome, dadosProf.descricao, uid);
 
            setIsDialogOpen(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);

            const data = await profFunc.findProf(uid);
            setProfs(data.data);

        } catch (error: any) {
            console.log('Erro ao submeter os dados do Prof');
            try {
                setDataError({
                    msg: JSON.parse(error)[0].message
                });
            } catch (err) {
                console.log('Erro ao efectuar as operações\n', err);
            }
        }
    };

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Professores e Orientadores" />
                <section className="w-full max-w-[1200px]  bg-gray-50 border  mt-1 border-l-0 border-violet-500 h-screen  text-gray-950">
                {showAlert && (
                        <AutoCloseAlert
                            title="Aluno cadastrado"
                            content="Aluno cadastrado com sucesso!"
                            bg="bg-green-600"
                        />
                )}
                    <div className="flex justify-between">
                        {/* <div className="flex mt-4 ml-6 gap-2">
                            <Input type="search" placeholder="Pesquisar Orientadores..." className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                            <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" ><IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar</Button>
                        </div> */}
                        <div className="flex mt-2 mr-2">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                <Button  onClick={() => setIsDialogOpen(true)} className="bg-violet-700 mb-2 text-white hover:bg-violet-800 ml-4 " ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar</Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Cadastrar Orientador 
                                        </DialogTitle>
                                        <DialogDescription>
                                        Digite os dados para cadastrar
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col mt-4'>
                                    <form onSubmit={profSubmit}>
                                                <div className='flex gap-4'>
                                                    <Label> Nome do Orientador <br/><br/>
                                                    <Input type='text' placeholder='Orientador ou Orientador' className='w-[180px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="nome" id="nome" value={dadosProf.nome} onChange={profMudado} />
                                                    </Label>
                                                    <Label form=''>  Descrição <br/><br/>
                                                    <Input type='text' placeholder='...' name='descricao' id="descricao" className='w-[180px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' value={dadosProf.descricao} onChange={profMudado}/>
                                                    </Label>
                                                </div>
                                                <Button className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full" ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" name="cadastrar" id="cadastrar"  strokeWidth={3} /> Cadastar Orientador</Button>
                                        </form>
                                     </div>
                                    <DialogFooter>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                    {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error.trim() === " " ? (
                            <div className="w-full text-red-700 font-semibold text-center">{error}, Porfavor entre em contacto com o suporte do site</div>
                        ) : (
                        <Table>
                            <TableCaption>Listagem dos Professores/Orientadores cadastrados</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Nome do Orientador</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="w-full">
                                {prof.map((dados: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-bold">{index + 1}</TableCell>
                                        <TableCell>{dados.nome}</TableCell>
                                        <TableCell>{dados.descricao.toUpperCase()}</TableCell>
                                        <TableCell className="text-right">
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Renomear</Button>
                                                    <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>)}
                    </ScrollArea>
                </section>
            </div>
        </div>
    )
} 