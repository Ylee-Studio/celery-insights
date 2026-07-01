import { useIsDark } from "@hooks/use-is-dark"
import { useSidebar } from "@components/ui/sidebar"
import { publicAssetPath } from "@lib/app-path"
import { Link } from "@tanstack/react-router"
import React from "react"

const SidebarLogo: React.FC = () => {
  const { state } = useSidebar()
  const expanded = state === "expanded"
  const isDark = useIsDark()

  const logoSrc = isDark
    ? expanded
      ? publicAssetPath("LogoTextGreen.svg")
      : publicAssetPath("LogoGreen.svg")
    : expanded
      ? publicAssetPath("LogoTextDark.svg")
      : publicAssetPath("LogoDark.svg")

  return (
    <Link to="/" className="flex items-center justify-center bg-transparent p-5 no-underline">
      <img
        src={logoSrc}
        alt="Celery Insights"
        className="h-auto transition-[width] duration-200"
        style={{ width: expanded ? "128px" : "32px" }}
      />
    </Link>
  )
}

export default SidebarLogo
