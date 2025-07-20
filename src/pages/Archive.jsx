import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/ContextProvider";
import BASE_URL from '../base_url';
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import emptyImage from "../images/empty.png";

const Archive = () => {
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const fetchArchivedNotes = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/note/archived`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(data.notes || []);
    } catch (error) {
      console.error("❌ Failed to fetch archived notes:", error);
      toast.error("Failed to load archived notes");
    }
  };

  useEffect(() => {
    if (user) fetchArchivedNotes();
  }, [user]);
  const unarchiveNote = async (id) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/note/${id}`,
        { archived: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Note Unarchived 🚀");
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      }
    } catch (error) {
      console.error("❌ Failed to unarchive note:", error);
      toast.error("Failed to unarchive note");
    }
  };


  const deleteNote = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Note Deleted");
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      }
    } catch (error) {
      console.error("❌ Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Archived Notes</h1>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src={emptyImage}
              alt="No Archived Notes"
              className="w-64 h-64 mb-4"
            />
            <p className="text-lg text-gray-600">No Archived Notes Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => { }}
                deleteNote={() => deleteNote(note._id)}
                toggleArchive={() => unarchiveNote(note._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
