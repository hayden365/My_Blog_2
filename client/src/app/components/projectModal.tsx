"use client";
import React, { useEffect } from "react";
import { ProjectData } from "../lib/types/project";
import { SubmitHandler, useForm } from "react-hook-form";
import ImageUploader from "./imageUploader";
import {
  Bars3BottomLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  CommandLineIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";
import { useCreateProject } from "../lib/hooks/useProject";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ isOpen, onClose }: ProjectModalProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<ProjectData>();

  const { mutate: createProject } = useCreateProject();

  const onSubmit: SubmitHandler<ProjectData> = (data) => {
    const processedData = {
      ...data,
      _id: "",
      links: data.links || {
        github: "",
        notion: "",
        demo: "",
        figma: "",
      },
    };

    createProject(processedData, {
      onSuccess: (data: ProjectData) => {
        console.log("Success", data);
        onClose();
      },
      onError: (error) => {
        console.log("Error", error);
      },
    });
  };

  const coverImg = watch("coverImg");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dim 처리된 배경 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose()}
      ></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 overflow-y-auto relative z-10 bg-white p-6 h-11/12 w-8/12 max-w-[500px] transition-transform duration-300 ease-out starting:opacity-0 starting:scale-50 opacity-100 scale-100"
      >
        <div className="w-full h-1/3 mb-4 pb-4 border-b border-gray-200">
          <ImageUploader
            image={coverImg}
            imageSetter={(url) => setValue("coverImg", url)}
          />
        </div>
        {/* --- */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center w-full relative mb-2">
            <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">title</span>
            <input
              {...register("title")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">description</span>
            <input
              {...register("description")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">myRole</span>
            <input
              {...register("myRole")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CommandLineIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">lang</span>
            <input
              {...register("language")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CommandLineIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">FE_tech</span>
            <input
              {...register("frontend_tech")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CommandLineIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">BE_tech</span>
            <input
              {...register("backend_tech")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>

          <label className="flex items-center w-full relative mb-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">startDate</span>
            <input
              type="date"
              {...register("startDate")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
              required
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">endDate</span>
            <input
              {...register("endDate")}
              className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
              placeholder="비어 있음"
            />
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CheckCircleIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">isGroup</span>
            <div className="flex justify-start w-6/10 right-0 absolute ml-8">
              <input
                type="checkbox"
                {...register("isGroupProject")}
                className="text-sm border-b-2 border-gray-200 p-1"
                placeholder="비어 있음"
              />
            </div>
          </label>
          <label className="flex items-center w-full relative mb-2">
            <CheckCircleIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 ml-2">isOngoing</span>
            <div className="flex justify-start w-6/10 right-0 absolute ml-8">
              <input
                type="checkbox"
                {...register("isOngoing")}
                className="text-sm border-b-2 border-gray-200 p-1"
                placeholder="비어 있음"
              />
            </div>
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center w-full relative mb-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-2">GitHub</span>
              <input
                {...register("links.github")}
                className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                placeholder="GitHub 링크"
              />
            </label>
            <label className="flex items-center w-full relative mb-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-2">Notion</span>
              <input
                {...register("links.notion")}
                className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                placeholder="Notion 링크"
              />
            </label>
            <label className="flex items-center w-full relative mb-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-2">Demo</span>
              <input
                {...register("links.demo")}
                className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                placeholder="Demo 링크"
              />
            </label>
            <label className="flex items-center w-full relative mb-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-2">Figma</span>
              <input
                {...register("links.figma")}
                className="text-sm right-0 absolute ml-8 border-b-2 border-gray-200 p-1 w-6/10 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                placeholder="Figma 링크"
              />
            </label>
          </div>
          <input
            type="submit"
            className="mt-4 border-black border-1 rounded-sm p-1 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default ProjectModal;
