
import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';
import { Card, CardContent } from '../components/ui/card';

const ReadingList = () => {
  const currentlyReading = [
    {
      id: 1,
      title: "Building with M3 Expressive",
      author: "Material Design",
      image: "https://lh3.googleusercontent.com/H8YNKWyGGqWfkHqNz6dPZ3MFzqOYtH9HlpQJRlQjKgKwQxHpFzR5XNE1KfNjCgQeJ9hQKQwE9HFhRN9nQ1E8QQ=w2400"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=400&h=600&fit=crop"
    }
  ];

  const wantToRead = [
    {
      id: 4,
      title: "System Design Interview",
      author: "Alex Xu",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&h=600&fit=crop"
    },
    {
      id: 5,
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=600&fit=crop"
    }
  ];

  const recommended = [
    {
      id: 7,
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=600&fit=crop"
    },
    {
      id: 8,
      title: "The Phoenix Project",
      author: "Gene Kim",
      image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=600&fit=crop"
    },
    {
      id: 9,
      title: "Refactoring",
      author: "Martin Fowler",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=600&fit=crop"
    }
  ];

  const BookCard = ({ book }: { book: { id: number; title: string; author: string; image: string } }) => (
    <Card className="bg-[#1a1a1a] border border-[#333] hover:border-[#555] transition-colors">
      <CardContent className="p-4">
        <div className="mb-3">
          <img
            src={book.image}
            alt={book.title}
            className="w-full object-cover rounded-md"
            style={{ aspectRatio: 'auto' }}
          />
        </div>
        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{book.title}</h4>
        <p className="text-gray-400 text-xs">{book.author}</p>
      </CardContent>
    </Card>
  );

  const BookSection = ({ title, books }: { title: string; books: typeof currentlyReading }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main className="md:ml-56 pb-20 md:pb-6">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-custom font-bold mb-6">Reading List</h1>
              <p className="text-lg">Books, articles, and resources I'm currently reading or recommend.</p>
            </div>
            
            <div className="space-y-8 mt-8">
              <BookSection title="Currently Reading" books={currentlyReading} />
              <BookSection title="Want to Read" books={wantToRead} />
              <BookSection title="Recommended" books={recommended} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default ReadingList;
