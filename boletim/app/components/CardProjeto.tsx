"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";

type TextProjeto = {
  text: string;
  projetoRef: string;
};

export default function CardProjeto(props: {
  projetoName: string;
  projetoRef: string;
}) {
  //modal IA
  const [isOpen, setIsOpen] = useState(false),
    [loadingAI, setLoadingAI] = useState(false),
    [textIA, setTextIA] = useState("");

  //conmfigura o formulário
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: textErrors },
  } = useForm<TextProjeto>();

  const onSubmitText: SubmitHandler<TextProjeto> = function (data) {
    //garante que o projeto selecionado são iguas aos vindos da prop
    if (data.projetoRef == props.projetoRef) {
      console.log(data);
    }
  };

  //função para enviar o texto para IA
  function postBoletimGeradorIA(projetoRef: string) {
    setLoadingAI(true);
    const axios = require("axios").default;

    axios
      .post("/api/boletimGeradorIA", {
        projeto: projetoRef,
        texto: watch("text"),
      })
      .then((data: object) => {
        console.log(data);
      })
      .catch((error: any) => {
        //verifica se o erro é do axios
        if (axios.isAxiosError(error)) {
          //verifica se o servior respondeu
          if (error.response) {
            console.log(error.response.data);
          } else {
            console.log("Erro de rede, o servidor não respondeu:", error);
          }
        } else {
          console.log("Erro interno inesperado:", error);
        }
      })
      .finally(() => {
        setLoadingAI(false);
      });
  }

  function boletimIA(projetoRef: string) {
    if (watch("text").length >= 5) {
      postBoletimGeradorIA(projetoRef);
      setIsOpen(true);
    }
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
          <DialogPanel className="max-w-3xl rounded-md bg-stone-950 p-12">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="meutexto">
                  Meu texto
                  <textarea
                    name=""
                    id="meutexto"
                    className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
                    defaultValue={watch("text")}
                  />
                </label>
              </div>
              <label htmlFor="textoIA">
                Gerado por IA
                {loadingAI ? (
                  <div className="w-full bg-stone-900 rounded-md h-52 p-3 animate-pulse mb-3">
                    <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
                    <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
                    <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
                    <div className="w-full bg-stone-800 rounded-md h-5 p-3 animate-pulse mb-3"></div>
                  </div>
                ) : (
                  <textarea
                    name="meutexto"
                    id="textoIA"
                    className="w-full bg-stone-900 rounded-md max-h-52 min-h-52 p-3"
                    defaultValue={textIA}
                  />
                )}
              </label>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-900 p-2 px-5 rounded-md mt-5"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-900 p-2 px-5 rounded-md mt-5"
              >
                Copiar texto gerado
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
                min: { value: 5, message: "Mínimo de 5 caracteres" },
                maxLength: { value: 300, message: "Maximo de 100 caracteres" },
                pattern: {
                  value:
                    /^[A-Za-z0-9,!@#$%&*().;:? \n\s\u00C0-\u00FF\u0100-\u017F]+$/i,
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
