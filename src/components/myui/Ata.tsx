import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RelatorioAta: React.FC = () => {
  const generatePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      // Crie um documento PDF
      const pdf = new jsPDF('p', 'px', 'a4');

      // Adicione a imagem ao PDF com o tamanho ajustado
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Salve o PDF
      pdf.save('relatorio_ata.pdf');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div id="pdf-content" style={{ padding: '20px', background: 'white', width: '595px', height: '842px' }}>
        <center>MINISTÉRIO DA EDUCAÇÃO</center>
        <center>INSTITUTO POLITÉCNICO PRIVADO ANHERC</center>
        <center>ÁREA DE FORMAÇÃO DE INFORMÁTICA</center>
        <center>CURSO: TÉCNICO DE INFORMÁTICA</center>
        <br />
        <center><b>ATA DO TRABALHO DE FIM DO CURSO</b></center>
        <center><b>TÍTULO DO SISTEMA OU PROJECTO APRESENTADO</b></center>
        <br />
        <p>
          Aos 28 do mês de Março de 2024, em LUANDA às 07 horas, na sala 13, Do Instituto Politécnico Privado Anhcer, realizou-se a sessão pública de defesa de trabalho de fim do curso de técnico de informática, o (a) estudante <span style={{ color: 'red' }}>PAULO MIGUEL ALFREDO KIALA</span>, sob a orientação de BERNADO ANTÓNIO MARTINS, que teve como o tema “SISTEMA DE GESTÃO ESCOLAR”, a comissão examinadora, composta por ALBETO JOÃO, PEDRO MARTINS E MIGUEL AFONSO, mediante a apresentação e defesa do trabalho, obteve <span style={{ color: 'red' }}>16 valores</span>
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
        <p>MIGUEL FAUSTINO ANDRÉ</p>
      </div>
      <button onClick={generatePDF}>Gerar PDF</button>
    </div>
  );
};

export default RelatorioAta;
