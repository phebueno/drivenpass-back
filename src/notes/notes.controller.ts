import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()  
  create(@Body() createNoteDto: CreateNoteDto, @User() user) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@User() user) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
