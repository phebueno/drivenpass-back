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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
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

@ApiTags('credentials')
@Controller('credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard) //define para todas as rotas
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({summary: "Create a new credential."})
  @ApiBody({ type: CreateCredentialDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credentials created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User's credential title already in use.",
  })
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @ApiOperation({summary: "Get user's credentials."})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned credentials array.',
  })
  findAll(@User() user) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({summary: "Get user credential by id."})
  @ApiParam({ name: 'id', description: "credential's id", example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned single credential.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete user credential by id."})
  @ApiParam({ name: 'id', description: "credential's id", example: 1 })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deleted single credential.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  remove(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.credentialsService.remove(+id, user);
  }
}
