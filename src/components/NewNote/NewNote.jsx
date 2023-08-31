import { useState } from 'react';
import './NewNote.css';
import { newNote } from '../../utilities/notes-service';

export default function NewNote({ addNote, setError }) {
    const [text,setText] = useState('');
    const handleChange = (e) => setText(e.target.value);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await newNote({text});
            addNote(response);
            setText('');
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }
    return (
        <div className='form-container new-note-container'>
            <form onSubmit={handleSubmit}>
                <button>Add Note</button>
                <textarea value={text} onChange={handleChange} name="text" placeholder='New note' cols="60" rows="10" required></textarea>
            </form>
        </div>
    );
}