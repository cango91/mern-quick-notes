import { useState, useEffect } from 'react';
import { updateNote, deleteNote } from '../../utilities/notes-service';
import './NoteComponent.css';

export default function NoteComponent({ note, editNote, removeNote, setError }) {
    const [state, setState] = useState({
        editing: false,
        deleting: false,
        text: note.text,
    });

    useEffect(() => {
        setState(prevState => ({ ...prevState, text: note.text }));
    }, [note]);

    const toggleDeleting = () => setState(prevState => ({ ...prevState, deleting: !prevState.deleting, editing:false, text:note.text }));
    const toggleEditing = () => setState(prevState => ({ ...prevState, editing: !prevState.editing, text: note.text, deleting:false }));
    const handleChange = e => setState(prevState => ({ ...prevState, text: e.target.value }));
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if(!state.text.replace(/\s/g,'')) return;
            await updateNote({ ...note, text: state.text });
            setState(prevState => ({ ...prevState, editing: false }));
            editNote(note, state.text);
        } catch (error) {
            setError(error.message);
        }
    }
    const deleteOne = async () => {
        try {
            await deleteNote(note._id);
            setState(prevState => ({ ...prevState, deleting: false }));
            removeNote(note);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className='note-card'>
            <h4>{new Date(note.createdAt).toLocaleString()}</h4>
            <form className='note-form' onSubmit={handleSubmit}>
                <input type="hidden" name="_id" value={note._id} />
                <textarea required onChange={handleChange} name="text" disabled={!state.editing} rows="8" value={state.text} className={`note-text ${state.editing ? 'edit' : ''}`}></textarea>
                <div className="controls">
                    {state.editing ? (
                        <>
                            <button onClick={toggleEditing}>Cancel</button>
                            <button type='submit'>Save</button>
                        </>
                    ) : (
                        <button onClick={toggleEditing}>Edit</button>
                    )}
                    {state.deleting ? (
                        <>
                            Are you sure?
                            <button type='button' onClick={deleteOne}>Yes</button>
                            <button onClick={toggleDeleting}>No</button>
                        </>
                    ) : (
                        <button onClick={toggleDeleting}>Delete</button>
                    )}
                </div>
            </form>
        </div>
    );
}