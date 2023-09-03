import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '../utils/cryptr.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptrService: CryptrService,
  ) {}

  async create(credentialDto: CreateCredentialDto, user: User) {
    const existingCredential = await this.credentialsRepository.findByTitle(
      credentialDto.title,
      user.id,
    );
    if (existingCredential)
      throw new ConflictException(
        'You already created a credential with this title!',
      );

    const cryptr = this.cryptrService.getCryptrInstance();
    const encryptedPass = cryptr.encrypt(credentialDto.password);
    return await this.credentialsRepository.create(
      { ...credentialDto, password: encryptedPass },
      user,
    );
  }

  async findAll(user: User) {
    const credentials = await this.credentialsRepository.findAll(user.id);

    const cryptr = this.cryptrService.getCryptrInstance();
    credentials.map((cred) => {
      cred.password = cryptr.decrypt(cred.password);
    });
    return credentials;
  }

  async findOne(id: number, user: User) {
    const credential = await this.credentialStatus(id, user);
    const cryptr = this.cryptrService.getCryptrInstance();
    const decryptedPass = cryptr.decrypt(credential.password);
    return { ...credential, password: decryptedPass };
  }

  async remove(id: number, user: User) {
    const credential = await this.credentialStatus(id, user);
    return this.credentialsRepository.remove(credential.title, user.id);
  }

  private async credentialStatus(id: number, user: User) {
    const credential = await this.credentialsRepository.findOne(id);
    if (!credential) throw new NotFoundException('Credential not found!');
    if (credential.userId !== user.id)
      throw new ForbiddenException('Not owner of credential!');
    return credential;
  }
}
