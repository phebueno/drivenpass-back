import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({summary: "Create a new note."})
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Note created.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User's note title already in use.",
  })
  create(@Body() createNoteDto: CreateNoteDto, @User() user) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  @ApiOperation({summary: "Get user's notes."})
  @ApiResponse({ status: HttpStatus.OK, description: 'Returned notes array.' })
  findAll(@User() user) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({summary: "Get user note by id."})
  @ApiParam({ name: 'id', description: "note's id", example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returned single note.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @User() user) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete user note by id."})
  @ApiParam({ name: 'id', description: "note's id", example: 1 })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Deleted single note.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  remove(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.notesService.remove(+id, user);
  }
}
