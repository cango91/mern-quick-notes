const ObjectId = require('mongoose').Types.ObjectId;
const Note = require('../../models/note');
const tokenService = require('../../services/tokenService');
const enc = require('../../services/encryptionService');

const create = async (req, res, next) => {
    try {
        const noteData = {text: req.body.text}
        const tempNoteText = noteData.text;
        noteData.text = enc.encryptText(tempNoteText);
        noteData.user = getUserId(req);
        const note = await Note.create(noteData);
        note.text = tempNoteText;
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request' });
    }
}

const getAll = async (req, res, next) => {
    try {
        let notes = await Note.find({ user: new ObjectId(getUserId(req)) });
        notes = notes.map(note => (note.text = enc.decryptText(note.text), note));
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request' });
    }
}
const getOne = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note || !userOwnsResource(getUserId(req))) {
            res.status(401).json({ message: 'Resource not accessible' });
        }
        note.text = enc.decryptText(note.text);
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad Request' });
    }
}

const updateOne = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if(note){
            if(userOwnsResource(getUserId(req),note)){
                await note.updateOne({text:enc.encryptText(req.body.text)});
                res.status(200).json({message:'Note updated'});
            }else{
                res.status(403).json({message: 'Not Allowed'});
            }
        }else{
            res.status(404).json({message: 'Note not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json('Bad Request');
    }
}

const deleteOne = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if(note){
            if(userOwnsResource(getUserId(req),note)){
                await note.deleteOne();
                res.status(200).json({message:'Note deleted'});
            }else{
                res.status(403).json({message: 'Not Allowed'});
            }
        }else{
            res.status(404).json({message: 'Note not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json('Bad Request');
    }
}

const getUserId = request => {
    let token = request.get('Authorization') || request.query.token || null;
    if(!token) return null;
    return tokenService.getUserFromToken(request.get('Authorization').replace('Bearer ', ''))._id;
}

const userOwnsResource = (userId, resource) => {
    if (userId instanceof ObjectId) return userId.toString() === resource.user.toString();
    return userId === resource.user.toString();
}




module.exports = {
    new: create,
    getAll,
    getOne,
    updateOne,
    delete: deleteOne,
}