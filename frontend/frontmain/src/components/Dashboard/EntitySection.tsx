import React from "react";

interface EntitySectionProps {
  title: string;
  items: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  renderItem: (item: any) => React.ReactNode;
  form?: React.ReactNode;
}

const EntitySection: React.FC<EntitySectionProps> = ({
  title,
  items,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  renderItem,
  form,
}) => {
  return (
    <div
      className="backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6 text-black"
      style={{ backgroundColor: "#e6e6e6" }}
    >
      <h2 className="text-3xl font-semibold">{title}</h2>

      {/* Container de Pesquisa e Lista */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full p-2 bg-transparent border border-white/20 rounded-md mb-4 placeholder:text-black/0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black border-black"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <ul className="zebra-list space-y-2 h-53 overflow-y-auto pr-2">
          {items.map(renderItem)}
        </ul>
      </div>

      {/* Container do Formulário de Adição - apenas se form for fornecido */}
      {form && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
          {form}
        </div>
      )}
    </div>
  );
};

export default EntitySection;
