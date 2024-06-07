import * as React from "react";

interface SelectorProps {
  dados: Array<{ id: number; nome?: string; titulo?: string }>;
  onSelect: (selectedItems: Array<{ id: number; nome?: string; titulo?: string }>, e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value?: Array<{ id: number; nome?: string; titulo?: string }>;
  unCheckable?: boolean;
}

export default function Selector({ dados = [], onSelect, name, value: initialValues = [], unCheckable = false }: SelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Array<{ id: number; nome?: string; titulo?: string }>>([]);
  const [search, setSearch] = React.useState("");

  const filteredDados = dados.filter((d) => {
    const searchValue = search.toLowerCase();
    return d.nome?.toLowerCase().includes(searchValue) || d.titulo?.toLowerCase().includes(searchValue);
  });

  const handleSelect = (item: { id: number; nome?: string; titulo?: string }, e: React.ChangeEvent<HTMLInputElement>): void => {
    let newValue;
    if (unCheckable) {
      newValue = value.some(v => v.id === item.id) ? [] : [item];
      setOpen(false);  // Fechar o menu de opções quando unCheckable = true
    } else {
      newValue = value.some(v => v.id === item.id)
        ? value.filter(v => v.id !== item.id)
        : [...value, item];
    }
    setValue(newValue);
    onSelect(newValue, e);
  };

  return (
    <div className="relative inline-block w-min-[200px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200 w-full justify-between flex items-center px-4 py-2 border border-gray-300 rounded"
      >
        {value.length > 0 ? value.map(v => v.nome || v.titulo).join(", ") : "Selecione um item..."}
        <svg
          className="ml-2 h-4 w-4 shrink-0 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-300"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredDados.length > 0 ? (
              filteredDados.map((d) => (
                <li key={d.id} className="flex items-center px-4 py-2 hover:bg-slate-200">
                  <input
                    type="checkbox"
                    name={name}
                    checked={value.some(v => v.id === d.id)}
                    onChange={(e) => handleSelect(d, e)}
                    className={"mr-2"}
                  />
                  {d.nome || d.titulo}
                </li>
              ))
            ) : (
              <li className="px-4 py-2">A rever dados...</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
