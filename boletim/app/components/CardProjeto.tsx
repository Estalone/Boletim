"use client";

import { SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import React from "react";

type TextProjeto = {
  projetoRef: string;
  text: string;
  textCopia: string;
  textIA: string;
};

export default function CardProjeto(props: {
  projetoName: string;
  projetoRef: string;
}) {
  const [isOpen, setIsOpen] = useState(false); //modal IA
  const [iaStatus, setIaStatus] = useState(""); //seletor de status da busca IA
  const [salvarStatus, setSalvarStatus] = useState("salvarBtn"); //seletor de status do salvamento
  const [success, setSuccess] = useState(false); //seletor de status do salvamento
  const [textErrorIA, setTextErrorIA] = useState({ message: "" }); //Mensagem de erro de status da busca IA
  const [textIA, setTextIA] = useState(""); //Retorno da busca da IA (provisório)

  //configura o formulário
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: textErrors },
  } = useForm<TextProjeto>();

  function salvarBtn() {
    return (
      <button
        className="bg-blue-900 p-2 px-5 rounded-md mt-1 text-sm"
        type="submit"
      >
        Salvar
      </button>
    );
  }
  function loadingSalvar() {
    return (
      <div className="bg-blue-950 p-2 px-8 rounded-md mt-1 text-sm">
        <div className="h-5 w-5 rounded-full border-4 border-r-black/50 border-y-white/10 border-l-white/10 animate-spin"></div>
      </div>
    );
  }
  const salvarTexto = {
    loading: loadingSalvar(),
    salvarBtn: salvarBtn(),
  };
  type statusSalvarTexto = keyof typeof salvarTexto;

  const onSubmitText: SubmitHandler<TextProjeto> = function (data) {
    //garante que o projeto selecionado são iguas aos vindos da prop
    if (data.projetoRef == props.projetoRef) {
      setSalvarStatus("loading");
      const axios = require("axios").default;

      axios
        .post("/api/salvarTexto", {
          projeto: data.projetoRef,
          texto: data.text,
        })
        .then((data: object) => {
          setSuccess(true);
          console.log(data);
        })
        .catch((err: object) => {
          console.log(err);
        })
        .finally(() => {
          setSalvarStatus("salvarBtn");
        });
    }
  };
  //====================================================
  //funções de estado de pesquisa de IA
  //====================================================
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
        id="textoIA"
        className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
        defaultValue={textIA}
        {...register("textIA")}
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
    //TO DO, validar os dados enviados para a IAs
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
        setValue("textIA", data.data.message);
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
    //verifica se o mínimo de caracteres foi atingido QUANDO FECHAMOS O MODAL
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
    var textCopia = watch("textIA");
    setValue("textCopia", textCopia);
    setValue("text", textCopia);
  }

  function gerarTextoIA(projetoRef: string) {
    GeradorIA(projetoRef);
  }

  return (
    <>
      {/*
        MODAL DE PESQUISA IA
      */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="min-[1000px]:min-w-[900px] max-[1000px]:w-full rounded-md bg-stone-950 p-12">
            <DialogTitle className="mb-10">
              <p className="text-2xl">
                Boletim IA <SparklesIcon className="size-5 inline" />
              </p>
              <span className="text-sm">
                {" "}
                Use a inteligência artificial para te ajudar!
              </span>
            </DialogTitle>
            <div className="grid grid-cols-2 gap-3 max-[1000px]:grid-cols-1">
              <div>
                <label htmlFor="meutexto">
                  <div className="flex mb-3">
                    <div>Meu texto</div>
                    <div className="ml-3">
                      <button
                        className="px-2 rounded bg-green-900 text-sm"
                        onClick={() => gerarTextoIA(props.projetoRef)}
                      >
                        Gerar
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="meutexto"
                    className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
                    {...register("textCopia")}
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
                    <div>Gerado por IA</div>
                    <div className="ml-3">
                      <button
                        className="px-2 rounded bg-blue-900 text-sm"
                        onClick={() => copiaTextoGerado()}
                      >
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
      {/*
        FIM DO MODAL DE PESQUISA IA
      */}
      {!success ? (
        <>
          <div className="bg-stone-800 p-3 rounded mb-4 min-h-56">
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
                  className="bg-stone-700 w-full max-h-28 min-h-28 rounded-lg p-2"
                  {...register("text", {
                    required: "Este campo deve ser preenchido",
                    minLength: { value: 5, message: "Mínimo de 5 caracteres" },
                    maxLength: {
                      value: 300,
                      message: "Maximo de 100 caracteres",
                    },
                    pattern: {
                      value:
                        /^[A-Za-z0-9,!@#$%&*()/.;:? \n\s\u00C0-\u00FF\u0100-\u017F]+$/i,
                      message: "Este campo permite apenas letras e números",
                    },
                  })}
                  onChange={(e) => setValue("textCopia", e.target.value)}
                />
                {textErrors.text && (
                  <p className="text-sm text-red-500">
                    {textErrors.text.message}
                  </p>
                )}
                <div className="flex">
                  <button
                    className="bg-green-900 p-2 px-5 rounded-md mt-1 mr-3 text-sm"
                    onClick={() => boletimIA(props.projetoRef)}
                    type="button"
                  >
                    Boletim IA
                    <SparklesIcon className="size-4 inline ml-3" />
                  </button>
                  {salvarTexto[salvarStatus as statusSalvarTexto]}
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-baselinep-3 bg-stone-800 rounded mb-4 h-56">
          <div className="flex-1 self-center text-center">
            <p className="text-lg">
              <CheckCircleIcon className="size-5 inline mr-2" /> Salvo
            </p>
          </div>
        </div>
      )}
    </>
  );
}
