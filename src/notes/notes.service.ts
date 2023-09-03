import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {
  
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const existingNote = await this.notesRepository.findByTitle(
      createNoteDto.title,
      user.id,
    );
    if(existingNote) throw new ConflictException("You already created a note with this title!")
    
    return await this.notesRepository.create(createNoteDto, user);
  }

  async findAll(user: User) {
    return await this.notesRepository.findAll(user.id);
  }

  async findOne(id: number, user: User) {
    const note = await this.noteStatus(id, user);
    return note;
  }

  async remove(id: number, user: User) {
    const note = await this.noteStatus(id, user);
    return this.notesRepository.remove(note.title, user.id);
  }

  private async noteStatus(id: number, user: User){
    const note = await this.notesRepository.findOne(id);
    if(!note) throw new NotFoundException("Note not found!");
    if(note.userId !== user.id) throw new ForbiddenException("Not owner of note!")
    return note;
  }
}
