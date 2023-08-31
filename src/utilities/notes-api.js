import { sendRequest } from "./utils";
const BASE_URL = '/api/notes'

export async function getAllNotes(){
    return await sendRequest(BASE_URL);
}

export async function editNote(noteId,noteData){
    return await sendRequest(`${BASE_URL}/${noteId}?_method=PUT`,'POST',noteData);
}

export async function newNote(noteData){
    return await sendRequest(BASE_URL,'POST',noteData);
}

export async function deleteNote(noteId){
    return await sendRequest(`${BASE_URL}/${noteId}?_method=DELETE`,'POST');
}