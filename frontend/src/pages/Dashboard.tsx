import { useState } from "react";

const Dashboard = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "NOS-SubA 8-week prediction completed for the first 2 months of 2019",
    },
  ]);

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEdit = (id: number) => {
    const newText = prompt("Edit your note:");
    if (newText) {
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, text: newText } : note
        )
      );
    }
  };

  const handleCreate = () => {
    const newText = prompt("Enter your new note:");
    if (newText) {
      const newNote = {
        id: Date.now(),
        text: newText,
      };
      setNotes([...notes, newNote]);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-xl font-bold">Dashboard Sayfası</h1>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Notes</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-700 p-3 rounded-lg bg-gray-800 flex justify-between items-center"
            >
              <span>{note.text}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(note.id)}
                  className="text-blue-400 hover:underline"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-400 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
