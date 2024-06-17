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
import { IconCursorText, IconDots, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label }  from "@/components/ui/label";
import { useSession } from "../utils/loginAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { profSchema, profFunc } from "../utils/profUtils";
import { useRouter } from 'next/navigation';

export default function Orientadores() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState({ msg: "" });
    const [dadosProf, setDadosProf] = useState({ nome: "", descricao: "", senha: "", coordenador: false, orientador: false, banca: false });
    const [error, setError] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorCrs, setErrorCrs] = useState("");
    const [prof, setProfs] = useState<any[]>([]);
    const [editingProf, setEditingProf] = useState<any | null>(null);

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
        const { name, value, type, checked } = e.target;
        setDadosProf({
            ...dadosProf,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const profSubmit =  async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            profSchema.parse(dadosProf);
            if (editingProf) {
                await profFunc.updateProf(editingProf.id, dadosProf);
            } else {
                await profFunc.createProf(dadosProf.nome, dadosProf.descricao, dadosProf.senha, dadosProf.coordenador, dadosProf.orientador, dadosProf.banca, uid);
            }
            const data = await profFunc.findProf(uid);
            alert(editingProf ? "Professor atualizado com sucesso!" : "Foi cadastrado um novo professor!");
            setEditingProf(null);
            router.refresh();
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

    const startEditProf = (prof: any) => {
        setEditingProf(prof);
        setDadosProf({ nome: prof.nome, descricao: prof.descricao, senha: "", coordenador: prof.coordenador, orientador: prof.orientador, banca: prof.banca });
        setIsDialogOpen(true);
    };

    const deleteProf = async (id: number) => {
        if (confirm("Tem certeza que deseja deletar este professor?")) {
            await profFunc.deleteProf(id);
            router.refresh()
        }
    };

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Professores e Orientadores" />
                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-violet-500 h-screen text-gray-950">
                    <div className="flex justify-between">
                        <div className="flex mt-2 mr-2">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-700 mb-2 text-white hover:bg-violet-800 ml-4">
                                        <IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white w-min-[400px]'>
                                    <DialogHeader>
                                        <DialogTitle>{editingProf ? "Editar Orientador" : "Cadastrar Orientador"}</DialogTitle>
                                        <DialogDescription>Digite os dados para cadastrar</DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col mt-4'>
                                        <form onSubmit={profSubmit}>
                                            <div className='flex gap-6'>
                                                <Label> Nome do Orientador <br/><br/>
                                                <Input type='text' placeholder='Nome' className='w-[180px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="nome" id="nome" value={dadosProf.nome} onChange={profMudado} />
                                                </Label>
                                                <Label>Senha <br/><br/>
                                                <Input type='text' placeholder='Senha' className='w-[180px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name="senha"id="senha" value={dadosProf.senha} onChange={profMudado} />
                                                </Label>
                                            </div>
                                            <div className='flex flex-col gap-6 mt-4'>
                                                <Label> Descrição <br/><br/>
                                                    <Input type='text' placeholder='Descrição' name='descricao' id="descricao" className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' value={dadosProf.descricao} onChange={profMudado} />
                                                </Label>
                                                <div className='flex gap-4'>
                                                    <Label className="flex items-center">
                                                        <span className='mr-2 text-sm'>Coordenador</span>
                                                        <Input type="checkbox" name="coordenador" checked={dadosProf.coordenador} onChange={profMudado} />
                                                    </Label>
                                                    <Label className="flex items-center">
                                                        <span className='mr-2 text-sm'>Orientador</span>
                                                        <Input type="checkbox" name="orientador" checked={dadosProf.orientador} onChange={profMudado} />
                                                    </Label>
                                                    <Label className="flex items-center">
                                                        <span className='mr-2 text-sm'>Banca</span>
                                                        <Input type="checkbox" name="banca" checked={dadosProf.banca} onChange={profMudado} />
                                                    </Label>
                                                </div>
                                            </div>
                                            <Button className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full">
                                                <IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" name="cadastrar" id="cadastrar" strokeWidth={3} />
                                                {editingProf ? "Atualizar Orientador" : "Cadastrar Orientador"}
                                            </Button>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error.trim() === " " ? (
                            <div className="w-full text-gray-700 font-semibold text-center">Nenhum professor cadastrado!</div>
                        ) : (
                            <Table>
                                <TableCaption>Listagem dos Professores/Orientadores cadastrados</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Nome do Orientador</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prof.map((pr) => (
                                        <TableRow key={pr.id}>
                                            <TableCell className="font-medium">{pr.id}</TableCell>
                                            <TableCell>{pr.nome}</TableCell>
                                            <TableCell>
                                                {pr.descricao}
                                            </TableCell>
                                            <TableCell className="text-right" >
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                        <Button onClick={() => startEditProf(pr)} className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full"> <IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} />Editar</Button>
                                                        <Button onClick={() => deleteProf(pr.id)} className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
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
