"use client";

import Nav from "./components/Nav";
import {
  ArrowRightIcon,
  CheckIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type Cidade = {
  cidade: string;
};

type Projetos = {
  saudeSimples: any;
  GED: any;
  outsourcing: any;
  DOC: any;
  educacaoSimples: any;
};

export default function Home() {
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

  //configura o form do projeto
  const [projetoSelecionado, setProjetoSelecionado] = useState("");
  const {
    register: registerProjeto,
    handleSubmit: handleSubmitProjeto,
    formState: { errors: errorsProjeto },
  } = useForm<Projetos>();
  //ação ao confirmar o projeto
  const onSubmitProjeto: SubmitHandler<Projetos> = function (data) {
    console.log(data);
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

  return (
    <>
      <Nav cidade={cidadeSelecionada} />
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black col-span-2 p-5 rounded-md">
            {/*
              FORM PARA SELECIONAR A CIDADE
            */}
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
            {/*
              FORM PARA SELECIONAR O PROJETO
            */}
            <p className="text-lg mb-5">Qual projeto vamos preencher?</p>
            <form onSubmit={handleSubmitProjeto(onSubmitProjeto)}>
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
              <label htmlFor="educacaoSimples" className="flex cursor-pointer">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  id="educacaoSimples"
                  {...registerProjeto("educacaoSimples")}
                />
                <div className="checkbox"></div>
                <p className="ml-5">Educação Simples</p>
              </label>
              <button
                type="submit"
                className="bg-blue-900 p-2 px-5 rounded-md mt-5"
              >
                Avançar
                <ArrowRightIcon className="size-4 inline ml-3" />
              </button>
            </form>
          </div>
          <div className="bg-black p-5 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
