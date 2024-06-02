import Nav from '@/components/myui/Nav';
import "@/app/globals.css";
import Header from "@/components/myui/Header";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IconCursorText, IconDots, IconFilter, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useSession } from "../utils/loginAuth";
import { cursoFunctions } from "../utils/cursoUtils";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { alunoSchema, alunoFunc } from "../utils/alunoUtils";
import AutoCloseAlert from "@/components/myui/AutoCloseAlert"

export default function Pessoal() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [curso, setCursos] = useState<any[]>([]);  
    const [loading, setLoading] = useState(true);
    const [errorCrs, setErrorCrs] = useState("");
    const [dataError, setDataError] = useState({ msg: "" });
    const [dadosAluno, setDadosAluno] = useState({ nome: "", curso_id: 1, bi: "", telefone: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alunos, setAlunos] = useState<any[]>([]); 

    useEffect(() => {
        const fetchDadosCurso = async () => {
            try {
                const data = await cursoFunctions.findCurso(uid);
                console.log(data.data)
                if (data.success === false) {
                    setErrorCrs(String(data.error));
                    console.log("Erro ao buscar os cursos!");
                } else {
                    setCursos(data.data);
                }
            } catch (err) {
                console.log(err);
                setErrorCrs(String(err));
            } finally {
                setLoading(false);
            }
        };
        fetchDadosCurso();
    }, [uid]);

    useEffect(() => {
        const fetchDadosAluno = async () => {
            try {
                const data = await alunoFunc.findAluno(uid);
                console.log(data.data)

                if (data.success === false) {
                    setError(data.error);
                } else {
                    setAlunos(data.data);
                }
            } catch (err) {
                console.log(err);
                setError(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        fetchDadosAluno();
    }, [uid]);

    const alunoMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setDadosAluno({ ...dadosAluno, [e.target.name]: e.target.value });
    };

    const selectCursoMudado = (e: ChangeEvent<HTMLSelectElement>) => {
        const cursoId = Number(e.target.value);
        setDadosAluno({ ...dadosAluno, curso_id: cursoId });
    };

    const alunoSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            alunoSchema.parse(dadosAluno);
            const dados = await alunoFunc.createAluno(dadosAluno.nome, Number(dadosAluno.curso_id), dadosAluno.telefone, dadosAluno.bi, Number(uid));

            setIsDialogOpen(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);

            const data = await alunoFunc.findAluno(uid);
            setAlunos(data.data);
        } catch (error: any) {
            try {
                setDataError({
                    msg: JSON.parse(error)[0].message
                });
            } catch (err) {
                console.log('Erro ao efectuar as operações\n', err);
            }
        }
    };

    const buscaAlunos = async () => {
        const dados = await alunoFunc.findAluno(uid);
        console.log(dados);
    }
    
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Alunos" />
                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-yellow-500 h-screen text-gray-950">
                    {showAlert && (
                        <AutoCloseAlert
                            title="Aluno cadastrado"
                            content="Aluno cadastrado com sucesso!"
                            bg="bg-green-600"
                        />
                    )}
                    <div className="flex justify-between">
                        <div className="flex mt-4 ml-6 gap-2">
                            <Input type="search" placeholder="Pesquisar Alunos..." className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                            <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" onClick={buscaAlunos}><IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar</Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200">
                                        <IconFilter stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Filtrar
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex p-0 flex-col bg-white w-fit items-start">
                                    {loading ? (
                                        <div className="w-full text-gray-700 text-center">Carregando cursos...</div>
                                    ) : errorCrs.trim() !== "" ? (
                                        <div className="w-full text-red-700 font-semibold text-center">{errorCrs}, Por favor entre em contato com o suporte do site</div>
                                    ) : (
                                        <select className="px-4 py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" onChange={selectCursoMudado} value={dadosAluno.curso_id}>
                                            {curso.map((dados, index) => (
                                                <option key={index} value={dados.id} title={dados.descricao}>{dados.nome}</option>
                                            ))}
                                        </select>
                                    )}
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex mt-4 mr-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-violet-700 mb-2 text-white hover:bg-violet-800" onClick={() => setIsDialogOpen(true)} ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white sm:max-w-[625px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Cadastrar Aluno
                                        </DialogTitle>
                                        <DialogDescription>
                                            Cadastre dados do aluno
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={alunoSubmit}>
                                        <div className="flex-col mt-4 grid gap-4">
                                            <div className="flex gap-4">
                                                <Label> Nome Completo do Aluno <br/><br/><Input type="text" name="nome" id='nome' className="w-[200px] border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2" value={dadosAluno.nome} onChange={alunoMudado} /> </Label>
                                                <Label> Curso <br /><br />
                                                    {loading ? (<div className="w-full text-gray-700 text-center">Carregando cursos...</div>) : errorCrs.trim() !== "" ? (<div className="w-full text-red-700 font-semibold text-center">{errorCrs}, Por favor entre em contato com o suporte do site</div>) : (
                                                        <select id='curso_id' className="w-[180px] border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2 px-[8px] py-[9px] rounded-md" name="curso_id" onChange={selectCursoMudado} value={dadosAluno.curso_id}>
                                                            {curso.map((dados, index) => (
                                                                <option key={index} value={dados.id} title={dados.descricao}>{dados.nome}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </Label>
                                            </div>
                                            <div className="mt-4 flex gap-6">
                                                <Label> Telemóvel (+244) <br /><br /> <Input type="tel" id="telefone" name="telefone" placeholder="Ex: 940618064" max={9} className="flex-1 border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2" value={dadosAluno.telefone} onChange={alunoMudado} /> </Label>
                                                <Label> Nº BI <br /><br /><Input type="text" id="bi" name="bi" placeholder="Ex: 0024324536LA01" className="flex-1 border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2" value={dadosAluno.bi} onChange={alunoMudado} /></Label>
                                            </div>
                                            <Button type="submit" id="cadastrar" className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full" name='cadastrar'><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Aluno</Button>
                                        </div>
                                    </form>

                                        {dataError.msg && (
                                            <div className="text-red-600 text-center mt-2">{dataError.msg}</div>
                                        )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error.trim() !== "" ? (
                            <div className="w-full text-gray-700 font-semibold text-center">Nenhum aluno registrado!, comece adicionando os dados dos alunos</div>
                        ) : (
                            <Table>
                                <TableCaption>Listagem dos Alunos cadastrados</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead>Nome Completo</TableHead>
                                        <TableHead className="w-[180px]">Curso</TableHead>
                                        <TableHead>Telefone (+244)</TableHead>
                                        <TableHead>Nº BI</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="w-full">
                                    {alunos.length > 0 ? alunos.map((aluno, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-bold">{index + 1}</TableCell>
                                            <TableCell>{aluno.nome}</TableCell>
                                            <TableCell><span className="px-4 py-2 rounded-lg bg-zinc-50">{  curso.find(c => c.id == aluno.curso_id)?.nome || "Nenhum"}</span></TableCell>
                                            <TableCell>{aluno.telefone}</TableCell>
                                            <TableCell>{aluno.bi}</TableCell>
                                            <TableCell className="text-right">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className="text-black hover:bg-gray-100"><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                        <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full"><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Renomear</Button>
                                                        <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full"><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    )) : ("Nenhum dado mapeado")}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </section>
            </div>
        </div>
    );
}