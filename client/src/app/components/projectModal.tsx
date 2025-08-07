"use client";
import React, { useEffect } from "react";
import { ProjectData, ProjectFormData } from "../lib/types/project";
import { SubmitHandler, useForm } from "react-hook-form";
import ImageUploader from "./imageUploader";
import {
  Bars3BottomLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  CommandLineIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";
import { useCreateProject, useUpdateProject } from "../lib/hooks/useProject";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createPortal } from "react-dom";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectData; // 수정할 프로젝트 데이터
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<ProjectFormData>();

  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  // 기존 프로젝트 데이터가 있으면 폼에 미리 채우기
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        myRole: project.myRole,
        language: project.language,
        frontend_tech: project.frontend_tech?.join(", ") || "",
        backend_tech: project.backend_tech?.join(", ") || "",
        startDate: new Date(project.startDate).toISOString().split("T")[0],
        endDate: new Date(project.endDate).toISOString().split("T")[0],
        isGroupProject: project.isGroupProject,
        isOngoing: project.isOngoing,
        description: project.description,
        coverImg: project.coverImg,
        links: {
          github: project.links?.github || "",
          notion: project.links?.notion || "",
          demo: project.links?.demo || "",
          figma: project.links?.figma || "",
        },
      });
    }
  }, [project, reset]);

  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    const processedData = {
      ...data,
      endDate: data.isOngoing ? "" : data.endDate,
      frontend_tech: data.frontend_tech
        .split(",")
        .map((tech) =>
          tech
            .trim()
            .toLowerCase()
            .replace(/[\/\-\_\.]+/g, "")
        )
        .filter((tech) => tech.length > 0),
      backend_tech: data.backend_tech
        .split(",")
        .map((tech) =>
          tech
            .trim()
            .toLowerCase()
            .replace(/[\/\-\_\.]+/g, "")
        )
        .filter((tech) => tech.length > 0),
      _id: project?._id || "",
      links: data.links || {
        github: "",
        notion: "",
        demo: "",
        figma: "",
      },
    };

    // 프로젝트가 있으면 수정, 없으면 생성
    if (project) {
      updateProject(processedData, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          console.log("Error");
        },
      });
    } else {
      createProject(processedData, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          console.log("Error");
        },
      });
    }
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* dim 처리된 배경 - 여기서만 클릭 차단 */}
      <div
        className="cursor-default absolute inset-0 bg-black/50"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></div>

      {/* 모달 컨텐츠 - 클릭 이벤트 전파만 차단 */}
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl max-h-[90vh] w-full max-w-[600px] flex flex-col"
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트 전파만 차단
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col overflow-hidden"
        >
          {/* 헤더 영역 - 고정 높이 */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <div className="w-full h-40">
              <ImageUploader
                image={coverImg}
                imageSetter={(url) => setValue("coverImg", url)}
              />
            </div>
          </div>

          {/* 스크롤 가능한 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
              <label className="flex items-center w-full relative">
                <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">title</span>
                <input
                  {...register("title")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">myRole</span>
                <input
                  {...register("myRole")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <CommandLineIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">lang</span>
                <input
                  {...register("language")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <CommandLineIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  FE_tech
                </span>
                <input
                  {...register("frontend_tech")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <CommandLineIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  BE_tech
                </span>
                <input
                  {...register("backend_tech")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  startDate
                </span>
                <input
                  type="date"
                  {...register("startDate")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                  required
                />
              </label>

              <label className="flex items-center w-full relative">
                <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  endDate
                </span>
                <input
                  type="date"
                  value={project?.isOngoing ? "" : project?.endDate}
                  {...register("endDate")}
                  className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                  placeholder="비어 있음"
                />
              </label>

              <label className="flex items-center w-full relative">
                <CheckCircleIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  isGroup
                </span>
                <div className="flex justify-start ml-8">
                  <input
                    type="checkbox"
                    {...register("isGroupProject")}
                    className="text-sm border-b-2 border-gray-200 p-1"
                    placeholder="비어 있음"
                  />
                </div>
              </label>

              <label className="flex items-center w-full relative">
                <CheckCircleIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 ml-2 flex-shrink-0">
                  isOngoing
                </span>
                <div className="flex justify-start ml-8">
                  <input
                    type="checkbox"
                    {...register("isOngoing")}
                    className="text-sm border-b-2 border-gray-200 p-1"
                    placeholder="비어 있음"
                  />
                </div>
              </label>

              <div className="flex flex-col gap-3">
                <label className="flex items-center w-full relative">
                  <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500 ml-2 flex-shrink-0">
                    GitHub
                  </span>
                  <input
                    {...register("links.github")}
                    className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                    placeholder="GitHub 링크"
                  />
                </label>

                <label className="flex items-center w-full relative">
                  <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500 ml-2 flex-shrink-0">
                    Notion
                  </span>
                  <input
                    {...register("links.notion")}
                    className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                    placeholder="Notion 링크"
                  />
                </label>

                <label className="flex items-center w-full relative">
                  <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500 ml-2 flex-shrink-0">Demo</span>
                  <input
                    {...register("links.demo")}
                    className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                    placeholder="Demo 링크"
                  />
                </label>

                <label className="flex items-center w-full relative">
                  <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500 ml-2 flex-shrink-0">
                    Figma
                  </span>
                  <input
                    {...register("links.figma")}
                    className="text-sm ml-8 border-b-2 border-gray-200 p-1 flex-1 focus:shadow-lg focus:border-gray-500 focus:outline-none"
                    placeholder="Figma 링크"
                  />
                </label>
              </div>

              <div className="flex flex-col w-full relative">
                <div className="flex items-center mb-2">
                  <Bars3BottomLeftIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 ml-2">description</span>
                </div>
                <div className="w-full">
                  <div className="min-h-[200px] border border-gray-200 rounded-lg">
                    <SimpleEditor
                      setContent={(content) => setValue("description", content)}
                      content={project?.description}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 영역 - 고정 */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200">
            <input
              type="submit"
              value={project ? "프로젝트 수정" : "프로젝트 생성"}
              className="w-full bg-white text-black border border-gray-400 py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-100"
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
