"use client";

import Nav from "./components/Nav";
import CardProjeto from "./components/CardProjeto";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

type Cidade = {
  cidade: string;
};

//sendo adicionados novos projetos adicionar aqui para o checkbox
type Projetos = {
  saudeSimples: any;
  GED: any;
  outsourcing: any;
  DOC: any;
  educacaoSimples: any;
};

export default function Home() {
  const [semana, setSemana] = useState("");
  //configura o form da cidade
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");

  const {
    register: registerCidade,
    handleSubmit: handleSubmitCidade,
    formState: { errors: errorsCidade },
  } = useForm<Cidade>();

  //ação ao confirmar cidade
  const onSubmitCidade: SubmitHandler<Cidade> = function (data) {
    setCidadeSelecionada(data.cidade);
    console.log(data);
  };

  //form projetos
  const {
    register: registerProjeto,
    watch: watchProjeto,
    setValue: setValueProjeto,
    formState: { errors: errorsProjeto },
  } = useForm<Projetos>();

  //sendo adicionados novos projetos adicionar aqui para adicionar cards
  const projetosCard = {
    saudeSimples: watchProjeto("saudeSimples"),
    GED: watchProjeto("GED"),
    outsourcing: watchProjeto("outsourcing"),
    DOC: watchProjeto("DOC"),
    educacaoSimples: watchProjeto("educacaoSimples"),
  };

  //cidades do projeto
  const cidade = ["Cotia", "Itapevi", "Mauá", "Ibiuna", "Jahu", "Jales"];
  //exibe as cidades do projeto
  const exibeCidade = cidade.map((cidade, index) => {
    return (
      <option key={index} value={cidade}>
        {cidade}
      </option>
    );
  });

  //limpa o campo dos projetos
  function fechaPreenchimento() {
    setCidadeSelecionada("");
    setValueProjeto("saudeSimples", false);
    setValueProjeto("GED", false);
    setValueProjeto("educacaoSimples", false);
    setValueProjeto("outsourcing", false);
    setValueProjeto("DOC", false);
  }

  //semana referente ao preenchimento
  useEffect(() => {
    let dataAtual = new Date();
    let semanaAtual = dataAtual.getDay(); //dia da semana seg (1), ter (2), qua (3), qui (4), sex (5), sab (6), dom (0),
    let dia = dataAtual.getDate(); //dia
    let mes = dataAtual.getMonth(); //mes

    //subtrai o dia da semana para sempre cair no dia da segunda-feira
    const inicioSemana = {
      0: dia - 6, // domingo
      1: dia, //permanece na segunda
      2: dia - 1, //ter
      3: dia - 2, //qua
      4: dia - 3, //qui
      5: dia - 4, //sex
      6: dia - 5, //sab
    };

    //adiciona o dia da semana para sempre cair no dia da sexta-feira
    const finalSemana = {
      0: dia - 2, //dom
      1: dia + 4, //seg
      2: dia + 3, //ter
      3: dia + 2, //qua
      4: dia + 1, //qui
      5: dia, // sex
      6: dia - 1, //sab
    };

    //ajustando o dia para o padrão 00
    if (inicioSemana[semanaAtual] < 10) {
      inicioSemana[semanaAtual] = "0" + inicioSemana[semanaAtual];
    }

    //ajustando o dia para o padrão 00
    if (finalSemana[semanaAtual] < 10) {
      inicioSemana[semanaAtual] = "0" + inicioSemana[semanaAtual];
    }

    //ajustando o mês
    if (mes < 10) {
      mes = "0" + mes;
    }

    setSemana(
      inicioSemana[semanaAtual] +
        "/" +
        mes +
        " até " +
        finalSemana[semanaAtual] +
        "/" +
        mes
    );
  }, []);

  return (
    <>
      <Nav cidade={cidadeSelecionada} />
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 max-[1000px]:grid-cols-1">
          <div className="bg-black p-5 rounded-md transition-all col-span-1">
            {/*
              FORM PARA SELECIONAR A CIDADE
            */}
            {cidadeSelecionada.length <= 0 ? (
              <>
                <p className="text-lg mb-5">Qual cidade vamos preencher?</p>
                <form onSubmit={handleSubmitCidade(onSubmitCidade)}>
                  <select
                    className="w-full bg-stone-800 p-3 rounded-full"
                    {...registerCidade("cidade", { required: true })}
                  >
                    <option value="">-- Selecione</option>
                    {exibeCidade}
                  </select>
                  {errorsCidade.cidade && (
                    <p className="text-sm text-red-800">Selecione uma cidade</p>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-900 p-2 px-5 rounded-md mt-5"
                  >
                    Avançar
                    <ArrowRightIcon className="size-4 inline ml-3" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-lg mb-5">
                  Qual projeto vamos preencher em{" "}
                  <span className="bg-emerald-800 px-2 rounded-lg">
                    {cidadeSelecionada}
                  </span>
                  ?
                </p>
                <form>
                  <label htmlFor="saudeSimples" className="flex cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      id="saudeSimples"
                      {...registerProjeto("saudeSimples")}
                    />
                    <div className="checkbox"></div>
                    <p className="ml-5">Saúde Simples</p>
                  </label>
                  <label htmlFor="GED" className="flex cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      id="GED"
                      {...registerProjeto("GED")}
                    />
                    <div className="checkbox"></div>
                    <p className="ml-5">GED</p>
                  </label>
                  <label htmlFor="outsourcing" className="flex cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      id="outsourcing"
                      {...registerProjeto("outsourcing")}
                    />
                    <div className="checkbox"></div>
                    <p className="ml-5">Outsourcing</p>
                  </label>
                  <label htmlFor="DOC" className="flex cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      id="DOC"
                      {...registerProjeto("DOC")}
                    />
                    <div className="checkbox"></div>
                    <p className="ml-5">DOC+ Simples</p>
                  </label>
                  <label
                    htmlFor="educacaoSimples"
                    className="flex cursor-pointer"
                  >
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      id="educacaoSimples"
                      {...registerProjeto("educacaoSimples")}
                    />
                    <div className="checkbox"></div>
                    <p className="ml-5">Educação Simples</p>
                  </label>
                </form>
                <button
                  onClick={fechaPreenchimento}
                  className="bg-blue-900 p-2 px-5 rounded-md mt-5"
                >
                  <ArrowLeftIcon className="size-4 inline mr-3" />
                  Voltar
                </button>
              </>
            )}
          </div>
          {/*
            DIV PARA PREENCHIMENTO DOS PROJETOS
          */}
          <div className="bg-black p-5 rounded-md col-span-1">
            <p className="mb-4">
              Referência:{" "}
              <span className="bg-stone-800 px-3 rounded-full">
                {!semana ? "..." : semana}
              </span>
            </p>
            {projetosCard.saudeSimples && (
              <CardProjeto
                projetoName="Saúde Simples"
                projetoRef="saudeSimples"
              />
            )}
            {projetosCard.GED && (
              <CardProjeto projetoName="GED" projetoRef="GED" />
            )}
            {projetosCard.outsourcing && (
              <CardProjeto projetoName="Outsourcing" projetoRef="outsourcing" />
            )}
            {projetosCard.DOC && (
              <CardProjeto projetoName="DOC+ Simples" projetoRef="docSimples" />
            )}
            {projetosCard.educacaoSimples && (
              <CardProjeto
                projetoName="Educação Simples"
                projetoRef="educacaoSimples"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
