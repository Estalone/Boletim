import { SparklesIcon, CheckIcon } from "@heroicons/react/24/outline";
import { errorToJSON } from "next/dist/server/render";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type TextProjeto = {
  text: string;
  projetoRef: string;
};

export default function CardProjeto(props: {
  projetoName: string;
  projetoRef: string;
}) {
  //conmfigura o formuãrio
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

  function boletimAi() {
    console.log(watch("text"));
  }

  return (
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
            {...register("text")}
          />
          {textErrors.text && <p>Precisa ser preenchido</p>}
          <button
            className="bg-green-900 p-2 px-5 rounded-md mt-1 mr-3 text-sm"
            onClick={boletimAi}
          >
            Boletim AI
            <SparklesIcon className="size-4 inline ml-3" />
          </button>
          <button
            className="bg-blue-900 p-2 px-5 rounded-md mt-1 text-sm"
            type="submit"
          >
            Salvar
            <CheckIcon className="size-4 inline ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
