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
import { IconCursorText, IconDots, IconPlus, IconX } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cursoFunctions, cursoSchema } from "../utils/cursoUtils"
import { useSession } from "../utils/loginAuth"
import AutoCloseAlert from "@/components/myui/AutoCloseAlert"
import { useRouter } from 'next/navigation';

export default function Cursos() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [cursoData, setCursoData] = useState({ nome: '', descricao: '' });
    const [msg, setMsg] = useState({ message: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    
    useEffect(() => {
        const fetchDadosCurso = async () => {
            try {
                const data = await cursoFunctions.findCurso(uid);
                if (data.success === false) {
                    setError(data.error);
                } else {
                    setCursos(data.data);
                }
            } catch (err) {
                console.log(err)
                setError(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };

        fetchDadosCurso();
    }, [uid]);

    const cursoMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setCursoData({ ...cursoData, [e.target.id]: e.target.value });
    };

    const cursoSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            cursoSchema.parse(cursoData);
            await cursoFunctions.createCurso(cursoData.nome, cursoData.descricao, uid);
            setIsDialogOpen(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
            const data = await cursoFunctions.findCurso(uid);
            setCursos(data.data);
        } catch (error: any) {
            try {
                setMsg({
                    message: JSON.parse(error)[0].message
                });
            } catch (err) {
                console.log(error);
            }
        }
    };

    const deleteCurso = async (id: number) => {
        await cursoFunctions.deleteCurso(id)
        alert('Curso eliminado com sucesso!')
        router.refresh()
    }

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Cursos" />

                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-indigo-600 h-screen text-gray-950">
                    {showAlert && (
                        <AutoCloseAlert
                            title="Curso cadastrado"
                            content="Curso cadastrado com sucesso!"
                            bg="bg-green-600"
                        />
                    )}

                    {refresh && (
                        <AutoCloseAlert
                            title="Curso Eliminado!"
                            content="Curso eliminado permanentemente!"
                            bg="bg-red-600"
                        />
                    )}
                    <div className="flex justify-between">
                        <div className="flex mt-4 ml-6 gap-2">
                            {/* <Input type="search" placeholder="Pesquisar Cursos..." className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                            <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" onClick={() => console.log(cursos)}>
                                <IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar
                            </Button> */}
                        </div>
                        <div className="flex mt-4 mr-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-700 mb-2 text-white hover:bg-violet-800">
                                        <IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white sm:max-w-[625px]'>
                                    <DialogHeader>
                                        <DialogTitle>Curso</DialogTitle>
                                        <DialogDescription>Cadastre um determinado Curso</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={cursoSubmit}>
                                        <div className='flex-col mt-4 grid gap-4'>
                                            {msg.message.trim() !== "" && (<span className="text-red-600 text-sm">{msg.message}</span>)}

                                            <div className='flex gap-4'>
                                                <Label> Nome do Curso <br /><br />
                                                    <Input id="nome" type="text" placeholder="Nome do Curso" className="w-[200px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2" value={cursoData.nome} onChange={cursoMudado}  />
                                                </Label>
                                                <Label> Descrição <br /><br />
                                                    <Input id="descricao" type="text" placeholder="Descrição" className="w-[280px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2" value={cursoData.descricao} onChange={cursoMudado} />
                                                </Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full">
                                                <IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Curso
                                            </Button>
                                        </DialogFooter>
                                    </form>
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
                                <TableCaption>Listagem dos Cursos existentes</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Nome do Curso</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="w-full">
                                    {cursos.map((curso: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold">{index + 1}</TableCell>
                                            <TableCell>{curso.nome}</TableCell>
                                            <TableCell >{curso.descricao}</TableCell>
                                            <TableCell className="text-right">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className="text-black hover:bg-gray-100">
                                                            <IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                            <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" onClick={async () => {
                                                                await deleteCurso(curso.id)
                                                            }} >
                                                            <IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar
                                                        </Button>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
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