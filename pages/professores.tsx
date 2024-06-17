import Nav from '@/components/myui/Nav'
import "@/app/globals.css"
import Header from "@/components/myui/Header"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
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
import { Label } from "@/components/ui/label"
import { useSession } from "../utils/loginAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { profSchema, profFunc } from "../utils/profUtils";
import { useRouter } from 'next/navigation';
import FormBox from "@/components/myui/FormBox"; // Importe o FormBox

export default function Orientadores() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState({ msg: "" });
    const [dadosProf, setDadosProf] = useState({ nome: "", descricao: "", senha: "", coordenador: false, orientador: false, banca: false });
    const [selectedProf, setSelectedProf] = useState<any>(null); // Armazena o professor selecionado para edição
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [prof, setProfs] = useState<any[]>([]);

    useEffect(() => {
        const fetchProf = async () => {
            try {
                const data = await profFunc.findProf(uid);
                if (data.success === false) {
                    console.log("Erro ao buscar os professores!");
                } else {
                    setProfs(data.data);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProf();
    }, [uid]);

    const handleAction = async (values: any) => {
        try {
            profSchema.parse(values);
            if (selectedProf) {
                // Update existing professor
                await profFunc.updateProf(selectedProf.id, values);
            } else {
                // Create new professor
                await profFunc.createProf({ ...values, usuario_id: uid });
            }
            const data = await profFunc.findProf(uid);
            setProfs(data.data);
            setIsDialogOpen(false);
            setSelectedProf(null);
            setDadosProf({ nome: "", descricao: "", senha: "", coordenador: false, orientador: false, banca: false });
            alert("Operação realizada com sucesso!");
            router.refresh();
        } catch (error: any) {
            console.log('Erro ao submeter os dados do Prof');
            try {
                setDataError({
                    msg: JSON.parse(error)[0].message
                });
            } catch (err) {
                console.log('Erro ao efetuar as operações\n', err);
            }
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
                                    <Button onClick={() => { setIsDialogOpen(true); setSelectedProf(null); }} className="bg-violet-700 mb-2 text-white hover:bg-violet-800 ml-4">
                                        <IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {selectedProf ? 'Editar Orientador' : 'Cadastrar Orientador'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Digite os dados para {selectedProf ? 'editar' : 'cadastrar'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FormBox
                                        fields={{
                                            nome: { label: 'Nome do Orientador', type: 'text', value: selectedProf ? selectedProf.nome : '' },
                                            descricao: { label: 'Descrição', type: 'text', value: selectedProf ? selectedProf.descricao : '' },
                                            senha: { label: 'Senha', type: 'password', value: selectedProf ? selectedProf.senha : '' },
                                            coordenador: { label: 'Coordenador', type: 'checkbox', value: selectedProf ? selectedProf.coordenador : false },
                                            orientador: { label: 'Orientador', type: 'checkbox', value: selectedProf ? selectedProf.orientador : false },
                                            banca: { label: 'Banca', type: 'checkbox', value: selectedProf ? selectedProf.banca : false },
                                        }}
                                        actionButton={{ label: selectedProf ? 'Salvar Alterações' : 'Cadastrar Orientador', onReturn: handleAction }}
                                    />
                                    <DialogFooter>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : prof.length === 0 ? (
                            <div className="w-full text-gray-700 font-semibold text-center">Nenhum professor cadastrado!</div>
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
                                                        <Button className="text-black hover:bg-gray-100">
                                                            <IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                        <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full"
                                                            onClick={() => { setSelectedProf(dados); setIsDialogOpen(true); }}>
                                                            <IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Renomear
                                                        </Button>
                                                        <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full">
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
    )
}
