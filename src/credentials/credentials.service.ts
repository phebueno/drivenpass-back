import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';
import Cryptr from 'cryptr';
import { CryptrService } from '../utils/cryptr.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptrService: CryptrService,
  ) {} 

  async create(credentialDto: CreateCredentialDto, user: User) {
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
    const credential = await this.credentialsRepository.findOne(id);
    if (!credential) throw new NotFoundException('Credential not found!');
    if (credential.userId !== user.id)
      throw new ForbiddenException('Not owner of credential!');

    const cryptr = this.cryptrService.getCryptrInstance();
    const decryptedPass = cryptr.decrypt(credential.password);
    return { ...credential, password: decryptedPass };
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
