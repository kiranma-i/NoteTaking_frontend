import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/ContextProvider";
import BASE_URL from '../base_url';
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import emptyImage from "../images/empty.png";

const Important = () => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const fetchImportantNotes = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/note`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const importantNotes = data.notes.filter(note => note.isImportant);
      setNotes(importantNotes);
    } catch (error) {
      console.error("❌ Failed to fetch important notes:", error);
    }
  };

  useEffect(() => {
    if (user) fetchImportantNotes();
  }, [user]);

  const filteredNotes = notes.filter(note => {
    if (query.trim() === '') return true;
    const lowerQuery = query.toLowerCase();
    const matchesTitle = note.title?.toLowerCase().includes(lowerQuery);
    const matchesDescription = note.description?.toLowerCase().includes(lowerQuery);
    return matchesTitle || matchesDescription;
  });

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar setQuery={setQuery} /> {/* Pass setQuery to Navbar if search bar there */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Important Notes</h1>

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src={emptyImage}
              alt="No Important Notes"
              className="w-64 h-64 mb-4"
            />
            <p className="text-lg text-gray-600">No Important Notes Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => { }}
                deleteNote={() => { }}
                toggleArchive={() => { }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Important;
