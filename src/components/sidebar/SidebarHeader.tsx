interface SidebarHeaderProps {
  isAdmin?: boolean;
}

export const SidebarHeader = ({ isAdmin }: SidebarHeaderProps) => {
  return (
    <div className="h-16 flex items-center px-6 border-b border-gray-200">
      <span className="text-2xl font-bold text-[#1E40AF]">
        {isAdmin ? "TRAIQ Admin" : "TRAIQ"}
      </span>
    </div>
  );
};