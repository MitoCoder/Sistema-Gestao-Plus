import React, { useState } from "react";
import { Col, Row } from "antd";
import { Input, Button, Tabs, Select, InputNumber, Popconfirm } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Typography } from "antd";
import { saveAs } from "file-saver";
const { Title } = Typography;

const { TabPane } = Tabs;
const { TextArea } = Input;

const App = () => {
  //Codigo de Limpeza dos Campos Atualizado
  const [cep, setCep] = useState("");

  const [enderecoinst, setEnderecoinst] = useState("");

  const [nomeempresa, setnomeempresa] = useState("");

  const [contato, setcontato] = useState("");
  const [numerocontato, setnumerocontato] = useState("");

  const [contato2, setcontato2] = useState("");
  const [numerocontato2, setnumerocontato2] = useState("");

  const [tipodecontrato, settipodecontrato] = useState("");
  const [nlocal, setnlocal] = useState("");
  const [norcamento, setnorcamento] = useState("");
  const [ncontrato, setncontrato] = useState("");

  const [obsgeral, setobsgeral] = useState("");

  const [obs, setobs] = useState("");

  const [qtdcabines, setqtdcabines] = useState(null);

  const [limparModalVisible, setLimparModalVisible] = useState(false);

  const handleCancelarLimpar = () => {
    // Fechar o modal se o usuário cancelar
    setLimparModalVisible(false);
  };

  const handleLimparInput = () => {
    setEnderecoinst();
    setCep();

    setqtdcabines(null);

    setnomeempresa();

    setcontato();
    setnumerocontato();
    setcontato2();
    setnumerocontato2();
    settipodecontrato();
    setnlocal();
    setnorcamento();
    setncontrato();

    setobs();

    setSelectedManut();

    setSelectedPeriodo();

    setSelectedProduto();

    setValorUnitario(null);

    setvalortotal(null);

    console.log("Limpando o contrato...");

    // Fechar o modal após a confirmação
    setLimparModalVisible(false);
  };

  //Estados de Carregamento padrão
  const [selectedProduto, setSelectedProduto] = useState();

  const [selectedManut, setSelectedManut] = useState();

  const [selectedPeriodo, setSelectedPeriodo] = useState();

  const [values, setValues] = useState({
    valortotal: undefined,
    valortotal2: undefined,
    valortotal3: undefined,
    valortotal4: undefined,
    valortotal5: undefined,
    valortotal6: undefined,
    valorunitario: undefined,
    valorunitario2: undefined,
    valorunitario3: undefined,
    valorunitario4: undefined,
    valorunitario5: undefined,
    valorunitario6: undefined,
    freteentrega: undefined,
    freteretirada: undefined,
    freteavulso: undefined,
  });

  const onChange = (id, val) => {
    setValues({ ...values, [id]: val });
  };

  const inputnorcamento = document.getElementById("norcamento")?.value || "";
  const inputncontrato = document.getElementById("ncontrato")?.value || "";
  const inputnomeempresa = document.getElementById("nomeempresa")?.value || "";

  const inputcontato = document.getElementById("contato")?.value || "";
  const inputnumerocontato =
    document.getElementById("numerocontato")?.value || "";

  const inputcontato2 = document.getElementById("contato2")?.value || "";
  const inputnumerocontato2 =
    document.getElementById("numerocontato2")?.value || "";

  const inputtipodecontrato =
    document.getElementById("tipodecontrato")?.value || "";

  const inputobsgeral = document.getElementById("obsgeral")?.value || "";

  const inputqtdcabines = document.getElementById("qtdcabines")?.value || "";

  const inputobs = document.getElementById("obs")?.value || "";
  const inputprodutos = selectedProduto || "";

  const inputmanut = selectedManut || "";

  const algumProdutoSelecionado = selectedProduto;

  const [valorUnitario, setValorUnitario] = useState(values.valorunitario);

  const [valortotal, setvalortotal] = useState(values.valortotal);

  // API de Busca de Endereço de Instalação Geral
  function instalacaoCEP() {
    if (cep) {
      axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          const { data } = response;
          if (data.erro) {
            alert("CEP não encontrado. Verifique o CEP e tente novamente.");
          } else {
            setEnderecoinst(
              `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`
            );
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
        });
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  }

  // Gerador de Tabela e PDF Mapeado
  const gerarPDF = () => {
    const data = [
      [
        "Quant.\nCabines",
        "Modelos(s)*",
        "Quant.\nManutenção.",
        "Observações\nSobre a Entrega",
      ],
    ];
    const rowDatas = [[inputqtdcabines, inputprodutos, inputmanut, inputobs]];

    // Obtém a data atual do navegador
    const dataAtual = new Date();

    // Formata a data no formato desejado
    const dataFormatada = `${dataAtual.getDate()} de ${obterNomeMes(
      dataAtual.getMonth() + 1
    )} de ${dataAtual.getFullYear()}`;

    // Função para obter o nome do mês
    function obterNomeMes(mes) {
      const nomesMeses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ];
      return nomesMeses[mes - 1];
    }

    for (const rowData of rowDatas) {
      let isRowEmpty = true;

      for (let i = 0; i < rowData.length; i++) {
        if (i === 5 || i === 6) {
          // Verifica se o campo Valor Unitário e Valor Total é "R$ " seguido por espaços em branco
          if (rowData[i].startsWith("R$ ") && rowData[i].trim() === "R$") {
            rowData[i] = ""; // Remove o "R$"
          }
        }

        if (rowData[i]) {
          isRowEmpty = false;
          break;
        }
      }

      if (!isRowEmpty) {
        data.push(rowData);
      }
    }

    const pdf = new jsPDF("p", "px", "a4");

    const headerImage = new Image();
    headerImage.src = process.env.PUBLIC_URL + "/imagens/cabecalho.png";

    const insumoImage = new Image();
    insumoImage.src = process.env.PUBLIC_URL + "/imagens/insumo.png"; // Adding the insumo image

    const footerImage = new Image();
    footerImage.src = process.env.PUBLIC_URL + "/imagens/rodape.png";

    let imagesLoaded = 0;

    const addImagesToPDF = () => {
      imagesLoaded++;

      if (imagesLoaded === 3) {
        // Change to 3 for all images loaded
        const headerWidth = 450;
        const headerHeight = 100;
        const footerWidth = 450;
        const footerHeight = 48;

        pdf.addImage(headerImage, "PNG", 0, 0, headerWidth, headerHeight);

        if (data.length > 1) {
          const textXPosition = 11;
          const columnWidths = [30, 155, 70, 169];

          const titleFontSize = 8;
          const rowFontSize = 8;

          pdf.autoTable({
            head: [data[0]],
            body: data.slice(1),
            startY: headerHeight + 130,
            margin: { left: textXPosition },
            tableWidth: pdf.internal.pageSize.width - textXPosition * 2,
            columnStyles: {
              0: { columnWidth: columnWidths[0] },
              1: { columnWidth: columnWidths[1] },
              2: { columnWidth: columnWidths[2] },
              3: { columnWidth: columnWidths[3] },
              4: { columnWidth: columnWidths[4] },
              5: { columnWidth: columnWidths[5] },
              6: { columnWidth: columnWidths[6] },
            },
            tableLineWidth: 0.3,
            headStyles: { fontSize: titleFontSize, fillColor: [5, 10, 48] },
            bodyStyles: { fontSize: rowFontSize },
          });
        }

        pdf.addImage(
          footerImage,
          "PNG",
          0,
          pdf.internal.pageSize.height - footerHeight,
          footerWidth,
          footerHeight
        );

        pdf.setFontSize(9);

        // Função para desenhar uma linha com comprimento aleatório
        function drawRandomLine(x, y) {
          const randomLength = 100 + 323; // Ajuste os valores conforme necessário
          pdf.line(x, y, x + randomLength, y);
        }

        pdf
          .setFont("helvetica", "bold")
          .text(150, headerHeight + 10, `    GUIA DE ENTREGA: SISTEMA GESTÃO`);

        pdf.setFont("helvetica", "normal");

        pdf.text(190, headerHeight + 20, dataFormatada);

        // Coluna da direita
        const secondColumnX = 270;

        pdf
          .setFont("helvetica", "bold")
          .text(11, headerHeight + 30, `DADOS DE ENTREGA`);
        drawRandomLine(11, headerHeight + 35);
        pdf
          .setFont("helvetica", "normal")
          .text(
            30,
            headerHeight + 50,
            `Cliente | Razão Social: ${inputnomeempresa} `
          );
        pdf
          .setFont("helvetica", "normal")
          .text(30, headerHeight + 60, `Nº Orçamento: ${inputnorcamento} `);
        pdf
          .setFont("helvetica", "normal")
          .text(30, headerHeight + 70, `Nº Contrato: ${inputncontrato}  `);
        pdf
          .setFont("helvetica", "normal")
          .text(30, headerHeight + 80, `Endereço Instalação: ${enderecoinst}`);
        pdf
          .setFont("helvetica", "normal")
          .text(30, headerHeight + 90, `Nº: ${nlocal}`);
        pdf
          .setFont("helvetica", "normal")
          .text(30, headerHeight + 100, `CEP: ${cep}`);

        // Coluna da direita
        const secondColumnXDelivery = 270;

        pdf
          .setFont("helvetica", "normal")
          .text(
            secondColumnXDelivery,
            headerHeight + 50,
            `Nome Contato: ${inputcontato} `
          );

        pdf
          .setFont("helvetica", "normal")
          .text(
            secondColumnXDelivery,
            headerHeight + 60,
            `Contato de Instalação: ${inputnumerocontato}`
          );
        pdf
          .setFont("helvetica", "normal")
          .text(
            secondColumnXDelivery,
            headerHeight + 70,
            `Contato II: ${inputcontato2}`
          );
        pdf
          .setFont("helvetica", "normal")
          .text(
            secondColumnXDelivery,
            headerHeight + 80,
            `Contato de Instalação II: ${inputnumerocontato2} `
          );
        pdf
          .setFont("helvetica", "normal")
          .text(
            secondColumnXDelivery,
            headerHeight + 90,
            `Tipo de Contrato: ${inputtipodecontrato} `
          );

        pdf
          .setFont("helvetica", "bold")
          .text(11, headerHeight + 120, `PRODUTOS DESTE CONTRATO:`);
        drawRandomLine(11, headerHeight + 125);

        const textoYPosition = pdf.autoTable.previous.finalY + 5;

        pdf.setFontSize(7);
        pdf
          .setFont("helvetica", "normal")
          .text(11, textoYPosition + 10, `Observações: ${inputobsgeral}`);
        pdf
          .setFont("helvetica", "normal")
          .text(11, textoYPosition + 20, `Informações sobre a Entrega:`);
        pdf
          .setFont("helvetica", "bold")
          .text(
            11,
            textoYPosition + 30,
            `1 - Os itens citados na tabela foram entregues em plena condição de uso? SIM (  ) NÃO (  )\n2 - Os modelos recebidos são os contratados? SIM (  ) NÃO (  )\n3 - Confirmo perante minha assinatura que recebi os equipamentos contratados acima.`
          );
        drawRandomLine(11, textoYPosition + 50);

        function drawRandomLinee(x1, y, length) {
          const randomLength = length || 100; // Padrão para 100 se nenhum comprimento for fornecido
          const x2 = x1 + randomLength;
          pdf.line(x1, y, x2, y);

          // Adiciona um "X" no início da linha
          pdf.text(x1, y - 3, "X");
        }

        // Assinatura da Empresa
        drawRandomLinee(70, textoYPosition + 100, 100); // Ajuste o valor 150 conforme necessário para o comprimento desejado
        pdf
          .setFont("helvetica", "bold")
          .text(70, textoYPosition + 108, `     SISTEMA GESTÃO E MOBILE`);

        // Assinatura do Cliente
        drawRandomLinee(
          secondColumnX,
          textoYPosition + 100,
          100,
          `  ASSINATURA DO RESPONSAVEL`
        ); // Ajuste o valor 120 conforme necessário para o comprimento desejado
        pdf
          .setFont("helvetica", "bold")
          .text(
            secondColumnX,
            textoYPosition + 108,
            `      ASSINATURA DO RESPONSAVEL`
          );

        const pdfBlob = pdf.output("blob");
        const norcamento = document.getElementById("norcamento").value;
        const pdfNome = `Proposta - ${norcamento}.pdf`;

        saveAs(pdfBlob, pdfNome);
      }
    };

    headerImage.onload = () => {
      addImagesToPDF();
    };

    insumoImage.onload = () => {
      addImagesToPDF();
    };

    footerImage.onload = () => {
      addImagesToPDF();
    };
  };

  const calcularValorTotal = (qtd, valorUni) => {
    return qtd * valorUni;
  };

  const handleQuantidadeChange = (
    value,
    setQuantidade,
    setValorTotal,
    valorUni
  ) => {
    setQuantidade(value);
    const total = calcularValorTotal(value, valorUni);
    setValorTotal(total);
  };

  const handleValorUnitarioChange = (
    value,
    setValorUni,
    setValorTotal,
    qtd
  ) => {
    setValorUni(value);
    const total = calcularValorTotal(qtd, value);
    setValorTotal(total);
  };

  return (
    //Campos de Textos Diversos vou melhorar e arrumar essa bagunça
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Dados de Entrega" key="1">
        <Title level={3} style={{ color: "white" }}>
          Entrega: Mandou bem! agora vamos a Logistica.
        </Title>
        <Row gutter={16} style={{ display: "flex", alignItems: "flex-start" }}>
          <Col xs={24} md={8} lg={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "2px" }}>
                Nº Orçamento:
              </span>
              <Input
                placeholder="Ex. 4748-23"
                id="norcamento"
                className="norcamento-input"
                value={norcamento}
                onChange={(e) => setnorcamento(e.target.value)}
              />
              <span style={{ color: "white", marginBottom: "2px" }}>
                Nº Contrato:
              </span>
              <Input
                placeholder="Ex. 8423-23"
                id="ncontrato"
                className="ncontrato-input"
                value={ncontrato}
                onChange={(e) => setncontrato(e.target.value)}
              />
              <span style={{ color: "white", marginBottom: "2px" }}>
                Nome Empresa:
              </span>
              <Input
                placeholder="Davos Sistema Personalizados Ltda"
                id="nomeempresa"
                className="nomeempresa-input"
                value={nomeempresa}
                onChange={(e) => setnomeempresa(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "2px" }}>
                CEP Instalação:
              </span>
              <Input.Search
                placeholder="07242-130"
                id="cep"
                className="cep-input"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onSearch={instalacaoCEP}
              />
              <span style={{ color: "white", marginBottom: "2px" }}>
                Nº Instalação:
              </span>
              <Input
                placeholder="Ex. 111"
                id="nlocal"
                className="nlocal-input"
                value={nlocal}
                onChange={(e) => setnlocal(e.target.value)}
              />
              <span style={{ color: "white", marginBottom: "2px" }}>
                Endereço de Instalação:
              </span>
              <Input
                placeholder="R. Santa Isabel, Vila Sonia, Guarulhos/SP"
                value={enderecoinst}
                id="enderecoinst"
                className="enderecoinst-input"
                onChange={(e) => setEnderecoinst(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ marginBottom: "10px" }}></span>
              <img src="/imagens/entrega.png" alt="" width="160" height="100" />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                selectdjustify: "space-evenly",
                alignItems: "center",
                gap: "2px", // Espaçamento vertical entre os elementos
              }}
            >
              <div style={{ marginTop: "1px" }}>
                Selecione um produto antes de criar a Guia de Entrega!
              </div>

              <div>
                <Popconfirm
                  title="Deseja Limpar Form. Entrega?"
                  onConfirm={handleLimparInput}
                  onCancel={handleCancelarLimpar}
                  okText="Sim"
                  cancelText="Não"
                  visible={limparModalVisible}
                >
                  <Button danger onClick={() => setLimparModalVisible(true)}>
                    Limpar - Form. Entrega
                  </Button>
                </Popconfirm>

                <Button
                  type="primary"
                  onClick={gerarPDF}
                  disabled={!algumProdutoSelecionado}
                  style={{ marginLeft: "10px" }}
                >
                  Finalizar Form. Entrega
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </TabPane>

      <TabPane tab="Contatos e Observações" key="2">
        <Title level={3} style={{ color: "white" }}>
          Contatos e Informações: Emissão da Guia de Entrega
        </Title>
        <Row gutter={10} style={{ display: "flex", alignItems: "flex-start" }}>
          <Col xs={24} md={8} lg={8}>
            <div>
              <span style={{ color: "white", marginBottom: "2px" }}>
                Telefone contato I:
              </span>
              <Input
                placeholder="11 95720-7168"
                id="numerocontato"
                className="numerocontato-input"
                value={numerocontato}
                onChange={(e) => setnumerocontato(e.target.value)}
              />

              <span style={{ color: "white", marginBottom: "2px" }}>
                Nome contato I:
              </span>
              <Input
                placeholder="Thais Maciel"
                id="contato"
                className="contato-input"
                value={contato}
                onChange={(e) => setcontato(e.target.value)}
              />

              <span style={{ color: "white", marginBottom: "2px" }}>
                Telefone contato II:
              </span>
              <Input
                placeholder="11 95720-7199"
                id="numerocontato2"
                className="numerocontato2-input"
                value={numerocontato2}
                onChange={(e) => setnumerocontato2(e.target.value)}
              />

              <span style={{ color: "white", marginBottom: "2px" }}>
                Nome contato II:
              </span>
              <Input
                placeholder="Edvam Santos"
                id="contato2"
                className="contato2-input"
                value={contato2}
                onChange={(e) => setcontato2(e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={8} lg={8}>
            <div>
              <span style={{ color: "white", marginBottom: "1px" }}>
                Tipo de Contrato:
              </span>
              <Input
                placeholder="Obra ou Evento"
                id="tipodecontrato"
                className="tipodecontrato-input"
                value={tipodecontrato}
                onChange={(e) => settipodecontrato(e.target.value)}
              />
              <span style={{ color: "white", marginBottom: "1px" }}>
                Observações:
              </span>
              <TextArea
                rows={6}
                placeholder="Limite de no máximo 75 caracteres"
                maxLength={75}
                id="obsgeral"
                className="obsgeral-input"
                value={obsgeral}
                onChange={(e) => setobsgeral(e.target.value)}
              />
            </div>
          </Col>

          <Col xs={24} md={8} lg={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ marginBottom: "10px" }}></span>
              <img
                src="/imagens/entrega2.png"
                alt=""
                width="230"
                height="150"
              />
              <div style={{ marginTop: "1px" }}>
                Dica do Guru: Observações ajudam a facilitar a Entrega!
              </div>
            </div>
          </Col>
        </Row>
      </TabPane>

      <TabPane tab="Produtos" key="3">
        <Title level={3} style={{ color: "white", textAlign: "center" }}>
          Seleção dos Produtos: Emissão da Guia de Entrega
        </Title>

        <Row gutter={5} style={{ justifyContent: "center" }}>
          <Col>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Quantidade:
              </span>
              <InputNumber
                id="qtdcabines"
                className="qtdcabines-input"
                min={1}
                value={qtdcabines}
                onChange={(value) =>
                  handleQuantidadeChange(
                    value,
                    setqtdcabines,
                    setvalortotal,
                    valorUnitario
                  )
                }
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5} flex={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Descrição do Produto:
              </span>
              <Select
                placeholder="Lista de produtos"
                id="produtos"
                value={selectedProduto}
                onChange={(value) => setSelectedProduto(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="Cabine Sanitaria Portatil Modelo Standard" />
                <Select.Option value="Cabine Sanitaria Portatil Modelo Luxo" />
                <Select.Option value="Cabine Sanitaria Portatil Modelo Extra Luxo" />
                <Select.Option value="Cabine Sanitaria Portatil Modelo Convencional" />
                <Select.Option value="Sanitario Portatil Chuveiro" />
                <Select.Option value="Sanitario Portatil Kross" />
              </Select>
            </div>
          </Col>
          <Col xs={24} md={8} lg={3} flex={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Quant. Manutenção
              </span>
              <Select
                placeholder="Manutenções"
                id="manutencoes"
                value={selectedManut}
                onChange={(value) => setSelectedManut(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="0x Semana" />
                <Select.Option value="1x Semana" />
                <Select.Option value="2x Semana" />
                <Select.Option value="3x Semana" />
                <Select.Option value="4x Semana" />
                <Select.Option value="5x Semana" />
                <Select.Option value="6x Semana" />
                <Select.Option value="7x Semana" />
                <Select.Option value="Outros" />
              </Select>
            </div>
          </Col>
          <Col xs={24} md={8} lg={3} flex={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Observação:
              </span>
              <Input
                id="obs"
                className="obs-input"
                value={obs}
                onChange={(e) => setobs(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={3} flex={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Periodo
              </span>
              <Select
                placeholder="Periodo"
                id="periodo"
                value={selectedPeriodo}
                onChange={(value) => setSelectedPeriodo(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="Diaria" />
                <Select.Option value="Quinzenal" />
                <Select.Option value="Mensal" />
                <Select.Option value="Outros" />
              </Select>
            </div>
          </Col>
          <Col xs={24} md={8} lg={3}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Valor Unitario:
              </span>
              <InputNumber
                className="valorunitario-input"
                id="valorunitario"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace("R$ ", "").replace(/\./g, "")}
                onChange={(val) =>
                  handleValorUnitarioChange(
                    val,
                    setValorUnitario,
                    setvalortotal,
                    qtdcabines
                  )
                }
                value={valorUnitario}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={3}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "white", marginBottom: "8px" }}>
                Valor Total:
              </span>
              <InputNumber
                className="valortotal-input"
                id="valortotal"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace("R$ ", "").replace(/\./g, "")}
                onChange={(val) => {
                  setvalortotal(val);
                  onChange("valortotal", val);
                }}
                value={valortotal}
                readOnly
              />
            </div>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
};

export default App;
