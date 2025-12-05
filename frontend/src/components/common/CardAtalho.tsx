import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
};

export function CardAtalho({ icon, title, description, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition flex gap-3 items-start"
    >
      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </button>
  );
}
