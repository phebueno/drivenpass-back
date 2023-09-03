import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {
  
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    //verify if its user unique
    return await this.notesRepository.create(createNoteDto, user);
  }

  async findAll(user: User) {
    return await this.notesRepository.findAll(user.id);
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepository.findOne(id);
    if(!note) throw new NotFoundException("Note not found!");
    if(note.userId !== user.id) throw new UnauthorizedException("Not owner of note!")
    return note;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
