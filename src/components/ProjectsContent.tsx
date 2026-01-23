import React from 'react';
import { Link } from 'react-router-dom';
import { craftApi } from '../services/craftApi';
import { getPostSlug } from '../lib/slugify';
import { useProjects } from '../hooks/useCraftApi';

const PROJECT_THUMBNAIL_OVERRIDE_PREFIXES: Record<string, string> = {
  // Place the provided image at: public/projects/tata-motors-order.png
  // Uses prefix matching so minor title changes won't break thumbnails.
  'simple-and-faster-way-to-place-orders-to-exchange': '/projects/tata-motors-order.png',
};

const ProjectsContent = () => {
  const { data: projects = [], isLoading: loading } = useProjects();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="w-full aspect-square bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Projects</h1>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center py-8 col-span-2">
            No projects found.
          </p>
        ) : (
          projects.map((project) => {
            const imageUrl = craftApi.getPostImage(project);
            const slug = getPostSlug(project.title);
            const overrideImageUrl =
              Object.entries(PROJECT_THUMBNAIL_OVERRIDE_PREFIXES).find(([prefix]) =>
                slug.startsWith(prefix)
              )?.[1] ?? null;
            const resolvedImageUrl = overrideImageUrl ?? imageUrl;

            return (
              <Link
                key={project.id}
                to={`/projects/${slug}`}
                state={{ postId: project.id }}
                className="block group hover:opacity-80 transition-opacity"
              >
                <div className="flex flex-col">
                  {/* Image */}
                  <div className="w-full aspect-square rounded-lg bg-[#2a2a2a] flex-shrink-0 overflow-hidden mb-2">
                    {resolvedImageUrl ? (
                      <img
                        src={resolvedImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-white group-hover:text-gray-100 text-xl leading-snug">
                    {project.title}
                  </h2>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectsContent;

