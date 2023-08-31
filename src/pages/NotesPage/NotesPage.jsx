import { useEffect, useState } from "react";
import { getAllNotes } from "../../utilities/notes-service";
import NoteComponent from "../../components/NoteComponent/NoteComponent";
import NewNote from "../../components/NewNote/NewNote";
import './NotesPage.css';


export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    const [sort,setSort] = useState(1);
    useEffect(() => {
        async function getNotes() {
            try {
                const response = await getAllNotes();
                if (response) {
                    setNotes(response.sort((a,b) => sort>0 ? new Date(b.createdAt) - new Date(a.createdAt) :new Date(a.createdAt) - new Date(b.createdAt)));
                    setNotes(response);
                }
            } catch (error) {
                setError("Couldn't get your notes.");
            }
        }
        getNotes();
        
    }, []);
    useEffect(()=>{
        const newState = [...notes];
        setNotes(newState.sort((a,b) => sort>0 ? new Date(b.createdAt) - new Date(a.createdAt) :new Date(a.createdAt) - new Date(b.createdAt)));
    },[sort]);
    function addNewNote(note) {
        if (notes) {
            setNotes(prevNotes => {
                const newNotes=[...notes];
                if(sort<0){
                    newNotes.push(note);
                }else{
                    newNotes.unshift(note);
                }
                return newNotes;
            });
        } else {
            setNotes([note]);
        }
    }
    function editNote(note, newText) {
        setNotes(prevNotes => {
            // don't accept empty string or only whitespace
            if (!newText || !newText.replace(/\s/g, '')) return prevNotes;
    
            const index = prevNotes.findIndex(el => el._id === note._id);
            if (index === -1) return prevNotes;  // Note not found
            
            const newNotes = [...prevNotes];
            newNotes[index] = { ...note, text: newText };
            return newNotes;
        });
    }
    
    function deleteNote(note) {
        setNotes(prevNotes => {
            const index = prevNotes.findIndex(el => el._id === note._id);
            if (index === -1) return prevNotes;  // Note not found

            const newNotes = [...prevNotes];
            newNotes.splice(index, 1);
            return newNotes;
        });
    }

    function handleSort(){
        setSort(sort * -1);
    }

    return (
        <>
         <p className="error-message">{error}</p>
            <NewNote addNote={addNewNote} setError={setError} />
            {
                notes && notes.length ?
                    <div className="notes-container">
                        <div></div><div><button onClick={handleSort} disabled={sort<0}>⬆</button><button onClick={handleSort} disabled={sort>0}>⬇</button></div><div></div>
                        {notes.map((note) => <NoteComponent note={note} key={note._id} editNote={editNote} removeNote={deleteNote} setError={setError} />)}
                    </div>
                    :
                    <p>You have no notes yo, add some!</p>
            }
           
        </>
    );
}