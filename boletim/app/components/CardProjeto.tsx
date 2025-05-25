import { SparklesIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function CardProjeto(props: { projetoName: string }) {
  return (
    <div className="bg-stone-800 p-3 rounded mb-4">
      <p className="mb-3">{props.projetoName}</p>
      <div className="">
        <form action="">
          <textarea className="bg-stone-700 w-full max-h-32 min-h-16 rounded-lg p-2" />
          <button className="bg-green-900 p-2 px-5 rounded-md mt-1 mr-3 text-sm">
            Boletim AI
            <SparklesIcon className="size-4 inline ml-3" />
          </button>
          <button className="bg-blue-900 p-2 px-5 rounded-md mt-1 text-sm">
            Salvar
            <CheckIcon className="size-4 inline ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
