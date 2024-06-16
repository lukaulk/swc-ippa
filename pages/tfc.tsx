import Nav from '@/components/myui/Nav';
import "@/app/globals.css";
import Header from "@/components/myui/Header";
import {
    Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { IconCursorText, IconDots, IconExclamationCircle, IconFilter, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSession } from "../utils/loginAuth";
import { alunoFunc } from '../utils/alunoUtils';
import Selector from "@/components/myui/Selector";
import { profFunc } from "../utils/profUtils";
import { tfcSchema, tfcFunc } from "../utils/tfcUtils";
import { cursoFunctions } from "../utils/cursoUtils";
import { GetStaticProps } from 'next';
import { useRouter } from 'next/navigation';
import prisma from "../utils/prisma";

export default function TFC() {
    const router = useRouter()
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [tfc, setTFC] = useState({
        titulo: "", dataEntrega: "", arquivo: "", aluno_id: [] as Array<{ id: number; nome: string }>,
        orientador_id: [] as Array<{ id: number; nome: string }>, observacoes: ""
    });
    const [listaTFC, setListaTFC] = useState([])

    const [filteredTFC, setFilteredTFC] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [alunos, setAlunos] = useState<any[]>([]);
    const [prof, setProfs] = useState<any[]>([]);
    const [cursos, setCursos] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [errorCrs, setErrorCrs] = useState("");
    const [error, setError] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSelect = (items: Array<{ id: number; nome: string }>, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTFC(prevTFC => ({ ...prevTFC, [name]: items }));
    };

    useEffect(() => {
        const fetchDadosAluno = async () => {
            try {
                const data = await alunoFunc.findAluno(uid);
                if (data.success === false) {
                    setErro(data.error);
                } else {
                    setAlunos(data.data);
                }
            } catch (err) {
                setErro(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        fetchDadosAluno();
    }, [uid]);
    useEffect(() => {
        const fetchProf = async () => {
            try {
                const data = await profFunc.findProf(uid);
                if (data.success === false) {
                    setErrorCrs(String(data.error));
                } else {
                    setProfs(data.data);
                }
            } catch (err) {
                setErrorCrs(String(err));
            } finally {
                setLoading(false);
            }
        };
        fetchProf();
    }, [uid]);
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
                setError(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        fetchDadosCurso();
    }, [uid]);
    useEffect(() => {
        const findTFC = async () => {
            try {
                const data = await tfcFunc.findtfc(uid);
                if (data.success === false) {
                    setError(data.error);
                } else {
                    setListaTFC(data.data);
                    setFilteredTFC(data.data)
                }
            } catch (err) {
                setError(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        findTFC();
    }, [uid]);

    
    const selectMudado = (e: ChangeEvent<HTMLSelectElement>) => {
        const cursoId = Number(e.target.value);
        setSelectedItems(cursoId);
    };
    const tfcMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setTFC({ ...tfc, [e.target.name]: e.target.value });
    };
    const fileHandle = (e: ChangeEvent<HTMLInputElement>) => {
        setTFC({ ...tfc, [e.target.name]: e.target.value });
    };

    const tfcSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const alunoID = String('[' + tfc.aluno_id.map((e) => { return e.id }) + ']')
        try {
            tfcSchema.parse(tfc)
            const response = await fetch('/api/tfc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...tfc,
                    aluno_id: alunoID,
                    orientador_id: tfc.orientador_id.length > 0 ? tfc.orientador_id[0].id : null,
                    usuario_id: uid,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert("Foi cadastrado um novo TFC com sucesso!")
                router.refresh()
                setIsDialogOpen(false);
            } else {
                setError(data.message);
            }
        } catch (err: any) {
            try {
                setError(JSON.parse(String(err))[0].message || "Erro ao cadastrar o TFC");
            } catch (error) {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const eliminarTFC = async (id: number) => {
        const res = await tfcFunc.delete(id)
        if (res.sucess === true) {
            alert("Dados Eliminado")
            router.refresh()
        }
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const filtraTFC = ()=>{
        let filtered = listaTFC;
        if (searchTerm) {
            filtered = filtered.filter((tfc:any) =>{
                return tfc.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            }) 
        }
        if (selectedItems !== null) {
            console.log('s:' + selectedItems)
            filtered = filtered.filter((aluno: any) =>{ 
                return aluno.curso_id === selectedItems 
            });
        }
        setFilteredTFC(filtered)
    }
    useEffect(() => {
        filtraTFC()
    }, [searchTerm, listaTFC, alunos, prof]);

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Trabalhos de Fim do Curso" />
                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-orange-500 h-screen text-gray-950">
                    <div className="flex justify-between">
                        <div className="flex mt-4 ml-6 gap-2">
                            <Input type="search" placeholder="Pesquisar TFCs..." onInput={handleSearch} className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                            <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200"><IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar</Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200"><IconFilter stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Filtrar</Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex px-4 py-4 flex-col bg-white items-start w-[340px]">
                                    <div className='w-full gap-4 flex-col flex'>
                                        <label className='flex gap-4 justify-between flex-1'>
                                            Orientador:
                                            {loading ? (
                                                <div className="w-full text-gray-700 text-center">Carregando professores...</div>
                                            ) : errorCrs.trim() !== "" ? (
                                                <div className="w-full text-red-700 font-semibold text-center">Nenhum prof cadastrado!</div>
                                            ) : (
                                                <select className="px-4 py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" onChange={selectMudado}>
                                                    {prof.map((dados, index) => (
                                                        <option key={index} value={dados.id}>{dados.nome}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </label>
                                        <label className='flex gap-4 justify-between flex-1'>
                                            Aluno:
                                            {loading ? (
                                                <div className="w-full text-gray-700 text-center">Carregando alunos...</div>
                                            ) : erro.trim() !== "" ? (
                                                <div className="w-full text-red-700 font-semibold text-center">Nenhum aluno cadastrado!</div>
                                            ) : (
                                                <select className="px-4 py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" onChange={selectMudado}>
                                                    {alunos.map((dados, index) => (
                                                        <option key={index} value={dados.id}>{dados.nome}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </label>
                                        <label className='flex gap-4 justify-between flex-1'>
                                            Data (Mês):
                                            <Input type='date' className=' w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                        </label>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex mt-4 mr-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-700 mb-2 text-white hover:bg-violet-800"><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar</Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white sm:max-w-[625px]'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Novo TFC
                                        </DialogTitle>
                                        <DialogDescription>
                                            Registro do Trabalho de fim do curso {error.trim() !== "" ? (<span className="text-white p-2 rounded-md bg-red-500">{error}</span>) : "Bem-vindo"}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={tfcSubmit}>
                                        <div className='flex-col mt-4 grid gap-4'>
                                            <div className='flex gap-4 w-full'>
                                                <Label className='w-full'> Título <br /><br />
                                                    <Input type='text' className='w-full flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="titulo" value={tfc.titulo} onChange={tfcMudado} />
                                                </Label>
                                            </div>
                                            <div className='mt-4 flex gap-6'>
                                                <Label className='flex gap-4 items-center flex-1'> Orientador:
                                                    <Selector dados={prof} onSelect={handleSelect} name="orientador_id" value={tfc.orientador_id} unCheckable={true} />
                                                </Label>
                                                <Label className='flex gap-4 items-center flex-1'> Aluno:
                                                    <Selector dados={alunos} onSelect={handleSelect} name="aluno_id" value={tfc.aluno_id} />
                                                </Label>
                                            </div>
                                            <div className='mt-4 flex gap-6'>
                                                <Label className='flex gap-4 items-center justify-between flex-1'>
                                                    Arquivo PDF (TFC)
                                                    <Input type='file' className='flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' accept='.pdf, .docx, .xlsx' name="arquivo" onChange={fileHandle} />
                                                </Label>
                                            </div>
                                            <div className='mt-4 flex gap-6'>
                                                <Label className='flex gap-4 items-center flex-1'>
                                                    Data Entrega
                                                    <Input type='date' className=' w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="dataEntrega" value={tfc.dataEntrega} onChange={tfcMudado} />
                                                </Label>
                                            </div>
                                            <div className='mt-4 flex gap-6'>
                                                <Label className='w-full flex flex-col'>
                                                    Observações <br /><br />
                                                    <Input type='text' className='flex-1 flex  w-full border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="observacoes" value={tfc.observacoes} onChange={tfcMudado} />
                                                </Label>
                                            </div>
                                            <Button type="submit" className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full"><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Novo TFC</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {loading ? (
                        <div className="w-full text-gray-700 text-center">Carregando...</div>
                    ) : error.trim() === " " ? (
                        <div className="w-full text-gray-700 font-semibold text-center">Nenhum dados registrado!</div>
                    ) : (
                        <ScrollArea className="h-[80vh] w-full">
                            <Table>
                                <TableCaption>Listagem dos TFCs</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead >Título</TableHead>
                                        <TableHead >Aluno</TableHead>
                                        <TableHead >Orientador</TableHead>
                                        <TableHead >Data de Entrega</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="w-full">
                                {String(listaTFC.length)}
                                 {filteredTFC.length > 0 ? filteredTFC.map((d:any, index:number) => (
                                     
                                    // {listaTFC.map((d: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold">{index + 1}</TableCell>
                                            <TableCell>{d.titulo}</TableCell>
                                            <TableCell>{alunos.filter(a => JSON.parse(d.aluno_id).includes(a.id)).map(e => e.nome).join(" • ")}</TableCell>
                                            <TableCell>{prof.filter(e => e.id == d.orientador_id[0]).map(c => c.nome)}</TableCell>
                                            <TableCell>{d.data_entrega.substr(0, 10)}</TableCell>
                                            <TableCell className="text-right">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                        {/* <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconExclamationCircle className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Sobre</Button> */}
                                                        <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Editar</Button>
                                                        <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" onClick={async () => {
                                                            await eliminarTFC(d.id)
                                                        }}><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    )) : ("Nenhum dado mapeado")}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </section>
            </div>
        </div>
    )
}
export const getStaticProps: GetStaticProps = async () => {
    const tfcs = await prisma.tfc.findMany();

    // Converta os objetos Date para strings
    const serializedTFCs = tfcs.map(tfc => ({
        ...tfc,
        data_entrega: tfc.data_entrega !== null ? tfc.data_entrega.toISOString() : "00-00-0000",
    }));

    return {
        props: {
            tfcs: serializedTFCs,
        },
    };
};

