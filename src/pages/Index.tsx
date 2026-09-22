import React, { useEffect } from 'react';
import ProfileContent from '../components/ProfileContent';
import ProjectsContent from '../components/ProjectsContent';
import WritingContent from '../components/WritingContent';

const Index = () => {
  useEffect(() => {
    document.title = 'Shubhank Pawar — Designer';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      <main id="main-content" className="max-w-2xl mx-auto px-6 py-14 md:py-20">
        <section id="hello" aria-labelledby="hello-heading" className="scroll-mt-16">
          <ProfileContent />
        </section>

        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="scroll-mt-16 mt-24 pt-16 border-t border-border"
        >
          <ProjectsContent />
        </section>

        <section
          id="writing"
          aria-labelledby="writing-heading"
          className="scroll-mt-16 mt-24 pt-16 border-t border-border"
        >
          <WritingContent />
        </section>
      </main>
    </div>
  );
};

export default Index;
