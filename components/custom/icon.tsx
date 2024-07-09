import { icons, LucideIcon as IconComponent } from "lucide-react";

type IconProps = {
  name: string;
  color: string;
  size: number;
  isActive: boolean;
  activeColor: string;
};

const Icon = ({ name, color, size, isActive, activeColor }: IconProps) => {
  const LucideIcon: IconComponent | undefined =
    icons[name as keyof typeof icons];

  if (!LucideIcon) {
    throw new Error(
      `Icon with name '${name}' does not exist in 'lucide-react' icons.`
    );
  }

  return <LucideIcon color={isActive ? activeColor : color} size={size} />;
};

export default Icon;
