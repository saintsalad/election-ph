import { NavigationProps } from "@/lib/definitions";
import { BadgeInfo, Fingerprint, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/custom/icon";

type MainNavigationProps = {
  navigations: NavigationProps[];
};

function MainNavigation({ navigations }: MainNavigationProps) {
  const pathname = usePathname();
  const pathParts = pathname?.split("/");
  const desiredPath = pathParts ? `/${pathParts[1]}` : "";

  return (
    <nav className='fixed bottom-0 left-0 z-50 w-full bg-background border-t flex flex-1 justify-center sm:hidden'>
      <div className='flex flex-1 justify-around items-center h-14 max-w-6xl '>
        {navigations &&
          navigations.map((item: NavigationProps, i: number) => (
            <Link
              key={i}
              href={item.route}
              className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
              prefetch={true}>
              <Icon
                activeColor='red'
                isActive={desiredPath === item.route}
                name={item.icon}
                color='black'
                size={23}
              />
              <span
                className={`text-xs ${
                  desiredPath === item.route && "text-red-600"
                }`}>
                {item.label}
              </span>
            </Link>
          ))}
      </div>
    </nav>
  );
}

export default MainNavigation;
