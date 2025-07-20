import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/ContextProvider";
import BASE_URL from '../base_url';
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import emptyImage from "../images/empty.png";

const Reminders = () => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/note`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const reminders = data.notes.filter(note => note.reminderAt);
      setNotes(reminders);
    } catch (error) {
      console.error("❌ Failed to fetch reminders:", error);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const filteredNotes = notes.filter(note => {
    if (query.trim() === '') return true;
    const lowerQuery = query.toLowerCase();
    const matchesTitle = note.title?.toLowerCase().includes(lowerQuery);
    const matchesDescription = note.description?.toLowerCase().includes(lowerQuery);
    const matchesLabels = note.labels?.some(label => label.toLowerCase().includes(lowerQuery));
    return matchesTitle || matchesDescription || matchesLabels;
  });

  return (
    <div className="bg-gray-200 min-h-screen min-w-screen">
      <Navbar setQuery={setQuery} /> {/* Pass setQuery to Navbar */}

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center mt-6">Reminder Notes</h1>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-full py-20">
            <img
              src={emptyImage}
              alt="No Reminders"
              className="w-64 h-64 mb-4 cursor-pointer"
            />
            <p className="text-lg text-gray-600">No Reminders Match</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => { }}
              deleteNote={() => { }}
              toggleArchive={() => { }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;
