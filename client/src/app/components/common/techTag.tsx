import React from "react";
import { FaReact } from "react-icons/fa";
import { FaNode } from "react-icons/fa6";
import { FaJs } from "react-icons/fa6";
import { TbBrandNextjs } from "react-icons/tb";
import { BiLogoTailwindCss, BiLogoTypescript } from "react-icons/bi";
import { BiLogoMongodb } from "react-icons/bi";
import {
  SiExpress,
  SiReactquery,
  SiRedux,
  SiSanity,
  SiStyledcomponents,
} from "react-icons/si";
import { twMerge } from "tailwind-merge";
import { GiPolarBear } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa6";

interface TechTagProps {
  name: string;
  className?: string;
}

const TECH_TAGS = {
  react: {
    name: "React",
    icon: <FaReact />,
  },
  nextjs: {
    name: "Next.js",
    icon: <TbBrandNextjs />,
  },
  nodejs: {
    name: "Node.js",
    icon: <FaNode />,
  },
  typescript: {
    name: "TypeScript",
    icon: <BiLogoTypescript />,
  },
  ts: {
    name: "TypeScript",
    icon: <BiLogoTypescript />,
  },
  javascript: {
    name: "JavaScript",
    icon: <FaJs />,
  },
  js: {
    name: "JavaScript",
    icon: <FaJs />,
  },
  mongodb: {
    name: "MongoDB",
    icon: <BiLogoMongodb />,
  },
  express: {
    name: "Express",
    icon: <SiExpress />,
  },
  tailwindcss: {
    name: "Tailwind CSS",
    icon: <BiLogoTailwindCss />,
  },
  styledcomponents: {
    name: "Styled Components",
    icon: <SiStyledcomponents />,
  },
  zustand: {
    name: "Zustand",
    icon: <GiPolarBear />,
  },
  tanstackquery: {
    name: "TanStack Query",
    icon: <SiReactquery />,
  },
  redux: {
    name: "Redux",
    icon: <SiRedux />,
  },
  reduxtoolkit: {
    name: "Redux Toolkit",
    icon: <SiRedux />,
  },
  sanity: {
    name: "Sanity",
    icon: <SiSanity />,
  },
};

const TechTag = ({ name, className }: TechTagProps) => {
  return (
    <div
      className={twMerge(
        "w-fit text-nowrap bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
        className
      )}
    >
      {TECH_TAGS[name as keyof typeof TECH_TAGS]?.icon || <FaQuestion />}
      <span>
        {TECH_TAGS[name as keyof typeof TECH_TAGS]?.name || "Default"}
      </span>
    </div>
  );
};

export default TechTag;
