"use client";

import {
  SparklesIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import React from "react";

type TextProjeto = {
  text: string;
  projetoRef: string;
};

export default function CardProjeto(props: {
  projetoName: string;
  projetoRef: string;
}) {
  const [isOpen, setIsOpen] = useState(false); //modal IA
  const [iaStatus, setIaStatus] = useState(""); //seletor de status da busca IA
  const [textErrorIA, setTextErrorIA] = useState({ message: "" }); //Mensagem de erro de status da busca IA
  const [textIA, setTextIA] = useState(""); //Retorno da busca da IA

  //conmfigura o formulário
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: textErrors },
  } = useForm<TextProjeto>();

  const onSubmitText: SubmitHandler<TextProjeto> = function (data) {
    //garante que o projeto selecionado são iguas aos vindos da prop
    if (data.projetoRef == props.projetoRef) {
      console.log(data);
    }
  };
  //funções de estado de pesquisa de IA
  function loadingIA() {
    return (
      <div className="w-full bg-stone-900 rounded-md h-52 p-3 animate-pulse mb-3">
        <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
        <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
        <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
        <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
      </div>
    );
  }
  function sucessoIA() {
    return (
      <textarea
        name="meutexto"
        id="textoIA"
        className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
        defaultValue={textIA}
        onChange={(e) => setTextIA(e.target.value)}
      />
    );
  }
  function erroIA() {
    return (
      <div className="w-full bg-red-900 rounded-md h-52 p-3 mb-3">
        <p>Tivemos um erro na hora de reformular seu texto</p>
        <p>{textErrorIA.message}</p>
      </div>
    );
  }
  const sendGeradorIA = {
    loading: loadingIA(),
    sucesso: sucessoIA(),
    erro: erroIA(),
  };
  type iaStatusExiste = keyof typeof sendGeradorIA;

  //função para enviar o texto para IA
  function GeradorIA(projetoRef: string) {
    setIaStatus("loading");
    const axios = require("axios").default;
    axios
      .post("/api/boletimGeradorIA", {
        projeto: projetoRef,
        texto: watch("text"),
      })
      .then((data: any) => {
        setIaStatus("sucesso");
        setTextIA(data.data.message);
      })
      .catch((error: any) => {
        //verifica se o erro é do axios
        if (axios.isAxiosError(error)) {
          //verifica se o servior respondeu
          if (error.response) {
            setIaStatus("erro");
            setTextErrorIA(error.response.data);
          } else {
            setIaStatus("erro");
            setTextErrorIA({ message: "Erro de rede, consultar o console." });
            console.log("Erro de rede, o servidor não respondeu:", error);
          }
        } else {
          setIaStatus("erro");
          setTextErrorIA({ message: "Erro interno, consultar o console." });
          console.log("Erro interno inesperado:", error);
        }
      });
  }

  function boletimIA(projetoRef: string) {
    //verifica se o mínimo de caracteres foi atingido QUANDO ATUALIZAMOS NO MODAL
    if (watch("text").length >= 5) {
      //não existindo erro prossegue abrindo o modal
      if (!textErrors.text) {
        //existindo um texto já gerado não envia os dados para gerar novamente
        if (textIA.length <= 0) {
          GeradorIA(projetoRef); //envia os dados para gerar IA
        }
        setIsOpen(true); //abre o modal
      }
    }
  }

  function copiaTextoGerado() {
    console.log(textIA);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="min-w-3xl rounded-md bg-stone-950 p-12">
            <DialogTitle className="mb-10">
              <p className="text-2xl">
                Boletim IA <SparklesIcon className="size-5 inline" />
              </p>
              <span className="text-sm">
                {" "}
                Use a inteligência artificial para te ajudar!
              </span>
            </DialogTitle>
            <Description></Description>
            <div className="grid grid-cols-2 gap-3 min-w-3xl">
              <div>
                <label htmlFor="meutexto">
                  Meu texto
                  <textarea
                    name=""
                    id="meutexto"
                    className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
                    defaultValue={watch("text")}
                    onChange={(e) => setValue("text", e.target.value)}
                  />
                  {textErrors.text && (
                    <p className="text-sm text-red-500">
                      {textErrors.text.message}
                    </p>
                  )}
                </label>
              </div>
              <div>
                <label htmlFor="textoIA">
                  <div className="flex mb-3">
                    <div className="flex-1">Gerado por IA</div>
                    <div>
                      <button className="px-2 rounded bg-blue-900 text-sm">
                        Copiar
                      </button>
                    </div>
                  </div>
                  {sendGeradorIA[iaStatus as iaStatusExiste]}
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-green-900 p-2 px-5 rounded-md mt-5"
              >
                Salvar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="bg-stone-800 p-3 rounded mb-4">
        <p className="mb-3">{props.projetoName}</p>
        <div className="">
          {/*
          PEGA A PROP projetoRef E DEIXA SELECIONADO COMO PADRÃO PARA PODERMOS SABER QUAL PROJETO ESTAMOS PREENCHENDO
          */}
          <form onSubmit={handleSubmit(onSubmitText)}>
            <input
              type="hidden"
              defaultValue={props.projetoRef}
              {...register("projetoRef")}
            />
            <textarea
              className="bg-stone-700 w-full max-h-32 min-h-16 rounded-lg p-2"
              {...register("text", {
                required: "Este campo deve ser preenchido",
                minLength: { value: 5, message: "Mínimo de 5 caracteres" },
                maxLength: { value: 300, message: "Maximo de 100 caracteres" },
                pattern: {
                  value:
                    /^[A-Za-z0-9,!@#$%&*()/.;:? \n\s\u00C0-\u00FF\u0100-\u017F]+$/i,
                  message: "Este campo permite apenas letras e números",
                },
              })}
            />
            {textErrors.text && (
              <p className="text-sm text-red-500">{textErrors.text.message}</p>
            )}
            <button
              className="bg-green-900 p-2 px-5 rounded-md mt-1 mr-3 text-sm"
              onClick={() => boletimIA(props.projetoRef)}
            >
              Boletim IA
              <SparklesIcon className="size-4 inline ml-3" />
            </button>
            <button
              className="bg-blue-900 p-2 px-5 rounded-md mt-1 text-sm"
              type="submit"
            >
              Salvar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
