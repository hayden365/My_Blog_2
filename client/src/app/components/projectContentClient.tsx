"use client";

import { useQuery } from "@tanstack/react-query";
import { getProject, getProjectPosts } from "../lib/fetch";
import { ProjectData } from "../lib/types/project";
import TechTag from "./common/techTag";
import TableOfContents from "@/app/components/common/tableOfContents";
import { FaGithub, FaLink } from "react-icons/fa";
import { RiNotionFill } from "react-icons/ri";
import { Post, POST_TYPES } from "../lib/types/post";
import { useEffect, useState } from "react";
import PostList from "./postList";
import TiptapRenderer from "./tiptapRenderer";
import "./tiptapRenderer.scss";

const ProjectContentClient = ({ _id }: { _id: string }) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");

  const { data: project, isLoading } = useQuery<ProjectData>({
    queryKey: ["project", _id],
    queryFn: () => getProject(_id),
  });

  const { data: projectPosts, isLoading: isPostsLoading } = useQuery<{
    posts: Post[];
    typeStats: { [key: string]: number };
  }>({
    queryKey: ["projectPosts", _id],
    queryFn: () => getProjectPosts(_id),
  });

  useEffect(() => {
    if (projectPosts) {
      setFilteredPosts(projectPosts.posts);
    }
  }, [projectPosts]);

  if (isLoading || isPostsLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const handleTypeFilter = (typeKey: string) => {
    const filteredPosts = projectPosts?.posts.filter((post) =>
      post.types?.includes(typeKey)
    );
    setFilteredPosts(filteredPosts || []);
    setSelectedType(typeKey);
  };

  const sections = [
    { id: "summary", title: "Summary" },
    { id: "related-posts", title: "Related Posts" },
    { id: "description", title: "Description" },
  ];

  return (
    <div className="w-full flex gap-12">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col gap-10">
        {/* 제목 */}
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <div className="flex gap-2 items-center">
            <span className="text-gray-500 text-sm">
              {project.isGroupProject ? "팀 프로젝트" : "개인 프로젝트"}
            </span>
            •
            <span className="text-gray-500 text-sm">
              {project.myRole.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 요약 */}
        <div id="summary" className="flex flex-col">
          <h3 className="text-xl font-bold mb-6 pb-4 w-full border-b border-gray-200">
            Summary
          </h3>
          <div className="flex items-center py-2">
            <span className="text-gray-500 text-sm w-1/5">Language</span>
            <TechTag name={project.language} />
          </div>
          <div className="flex items-center py-2">
            <span className="text-gray-500 text-sm w-1/5">Frontend</span>
            <div className="flex gap-2">
              {project.frontend_tech.map((tech) => (
                <TechTag key={tech} name={tech} />
              ))}
            </div>
          </div>
          {project.backend_tech.length > 0 && (
            <div className="flex items-center py-2">
              <span className="text-gray-500 text-sm w-1/5">Backend</span>
              <div className="flex gap-2">
                {project.backend_tech.map((tech) => (
                  <TechTag key={tech} name={tech} />
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center py-2">
            <span className="text-gray-500 text-sm w-1/5">Period</span>
            <span className="text-sm text-gray-500 mr-4">
              {project.startDate.split("T")[0]}
            </span>
            ~
            {project.endDate ? (
              <span className="text-sm text-gray-500 ml-4">
                {project.endDate.split("T")[0]}
              </span>
            ) : (
              <span className="bg-gray-100 text-red-500 px-2 py-1 rounded-full text-xs ml-4">
                진행 중
              </span>
            )}
          </div>
          <div className="flex items-center py-2">
            <span className="text-gray-500 text-sm w-1/5">Link</span>
            <div className="flex gap-2">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
                >
                  <FaGithub className="w-4 h-4 text-black" />
                  Github
                </a>
              )}
              {project.links?.notion && (
                <a
                  href={project.links.notion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
                >
                  <RiNotionFill className="w-4 h-4 text-black" />
                  Notion
                </a>
              )}
              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
                >
                  <FaLink className="w-4 h-4 text-black" />
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        <div id="related-posts" className="w-full flex flex-col gap-2 py-10">
          <h3 className="text-xl font-bold mb-6 pb-4 w-full border-b border-gray-200">
            Related Posts
          </h3>
          <div className="flex flex-col gap-2">
            {/* type folder */}
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <button
                className={`text-gray-500 text-xs sm:text-sm bg-gray-100 rounded-full px-4 py-2 ${
                  selectedType === "All" ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => {
                  setFilteredPosts(projectPosts?.posts || []);
                  setSelectedType("All");
                }}
              >
                # All
              </button>
              {projectPosts?.typeStats &&
                Object.entries(projectPosts.typeStats).map(([typeKey]) => {
                  const postType = POST_TYPES.find(
                    (type) => type.key === typeKey
                  );
                  if (!postType) return null;
                  return (
                    <button
                      key={typeKey}
                      className={`text-gray-500 text-xs sm:text-sm bg-gray-100 rounded-full px-4 py-2 ${
                        selectedType === typeKey ? "bg-gray-700 text-white" : ""
                      }`}
                      onClick={() => handleTypeFilter(typeKey)}
                    >
                      # {postType.label}
                    </button>
                  );
                })}
            </div>
            {filteredPosts.length > 0 ? (
              <PostList data={filteredPosts} />
            ) : (
              <div className="text-gray-500 text-sm">No posts found</div>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div id="description" className="w-full flex flex-col gap-2 py-10">
          <h3 className="text-xl font-bold pb-4 w-full mb-6 border-b border-gray-200">
            Description
          </h3>
          <TiptapRenderer content={project.description} className="prose" />
        </div>
      </div>

      {/* 사이드바 - Table of Contents */}
      <div className="hidden lg:block">
        <TableOfContents sections={sections} />
      </div>
    </div>
  );
};

export default ProjectContentClient;
