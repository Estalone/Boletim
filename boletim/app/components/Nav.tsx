"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Nav(props: { cidade: String }) {
  let cidade = props.cidade;

  return (
    <div className="container mx-auto p-5 max-w-7xl">
      <div className="flex">
        <div className="flex-1">
          <p className="text-2xl">Boletim semanal</p>
        </div>
        <div className="mr-5">
          <p className="bg-yellow-800 rounded px-4">{cidade}</p>
        </div>
        <div className="">
          <Bars3Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
