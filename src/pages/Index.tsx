import React, { useEffect } from 'react';
import ProfileContent from '../components/ProfileContent';
import ProjectsContent from '../components/ProjectsContent';
import WritingContent from '../components/WritingContent';
import ThemeToggle from '../components/ThemeToggle';
import SocialLinks from '../components/SocialLinks';

const Index = () => {
  useEffect(() => {
    document.title = 'Shubhank Pawar — Designer';
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-portfolio-dark text-foreground">
      <main id="main-content" className="max-w-2xl mx-auto px-6 py-14 md:py-20">
        {/* In the flow rather than floating, so it never sits on the content. */}
        <div className="mb-8 flex justify-end">
          <ThemeToggle compact />
        </div>

        <section id="hello" aria-labelledby="hello-heading" className="scroll-mt-16">
          <ProfileContent />
        </section>

        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="scroll-mt-16 mt-16"
        >
          <ProjectsContent />
        </section>

        <section
          id="writing"
          aria-labelledby="writing-heading"
          className="scroll-mt-16 mt-16"
        >
          <WritingContent />
        </section>

        <section
          id="connect"
          aria-labelledby="connect-heading"
          className="scroll-mt-16 mt-16"
        >
          <SocialLinks />
        </section>
      </main>
    </div>
  );
};

export default Index;
