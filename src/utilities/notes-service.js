import * as api from './notes-api';


export async function updateNote(noteData){
    const noteId = noteData._id;
    delete noteData._id;
    if(noteData.createdAt) delete noteData.createdAt;
    if(noteData.updatedAt) delete noteData.updatedAt;
    if(noteData.user) delete noteData.user;
    return await api.editNote(noteId,noteData);
}

export async function newNote(noteData){
    return await api.newNote(noteData);
}

export async function getAllNotes(){
    return await api.getAllNotes();
}

export async function deleteNote(noteId){
    return await api.deleteNote(noteId)
}