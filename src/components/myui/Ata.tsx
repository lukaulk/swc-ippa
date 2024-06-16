import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation'

const RelatorioAta: React.FC = () => {
  const router = useRouter()

  const generatePDF = async () => {

    const element = document.getElementById('pdf-content');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      // Crie um documento PDF
      const pdf = new jsPDF('p', 'px', 'a4');

      // Adicione a imagem ao PDF com o tamanho ajustado
      const imgWidth = canvas.width - 100;
      const imgHeight = canvas.height - 100;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Salve o PDF
      pdf.save('relatorio_ata.pdf');
      router.push('/inicio')
    }
  };

  const ataData = {
        curso : 'Informática',
        titulo: 'Sistema web Lukau',
        data: '02/03/2023',
        hi: '10:02',
        hf: '02:21',
        local: 'lianda',
        aluno: ['Daniel Lingua', 'Matola Jonas'],
        orientador: 1,
        banca: ['presidente', 'vogal1', 'vogal2'],
        valor: 20
  }

  return (
    <div className="flex items-center justify-center">
      <button onClick={generatePDF} className={'fixed right-0 top-0 px-5 py-2'}>Imprimir Relatório da ATA (PDF)</button>
      <div id="pdf-content" style={{ padding: '22px', background: 'white', width: '585px', height: '842px' , border: '1px solid black', boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.051)'}}>
        <center>MINISTÉRIO DA EDUCAÇÃO</center>
        <center>INSTITUTO POLITÉCNICO PRIVADO ANHERC</center>
        <center>ÁREA DE FORMAÇÃO DE  {ataData.curso}</center>
        <center>CURSO: TÉCNICO DE INFORMÁTICA</center>
        <br />
        <center><b>ATA DO TRABALHO DE FIM DO CURSO</b></center>
        <center><b>{ataData.titulo.toUpperCase()}</b></center>
        <br />
        <p>
          Aos 28 do mês de Março de 2024, em Luanda às {ataData.hi} horas, no (a) {ataData.local}, Do Instituto Politécnico Privado Anherc,
           realizou-se a sessão pública de defesa de trabalho de fim do curso de técnico de {ataData.curso},
           o (a) estudante <span style={{ color: 'red' }}>{ataData.aluno[0]}</span>, sob a orientação de 
           {ataData.orientador}, que teve como o tema “{ataData.titulo}”, a comissão examinadora,
            composta por {ataData.banca[0]}, ataData.banca[1] E ataData.banca[2], mediante a apresentação e defesa do trabalho,
             obteve <span style={{ color: 'red' }}>{ataData.valor} valores</span>
        </p>
        <br />
        <p><b>Banca examinadora:</b></p>
        <p>Presidente</p>
        <hr />
        <p>1º Vogal</p>
        <hr />
        <p>2º Vogal</p>
        <hr />
        <br />
        <p>
          Por ser verdade, a presente acta será assinada e autenticada por mim que a secretariei.
        </p>
        <br />
        <p>Secretário(a)</p>
        <hr />
      </div>
    </div>
  );
};

export default RelatorioAta;
