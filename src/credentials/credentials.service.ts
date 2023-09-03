import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';
import Cryptr from 'cryptr';
import { CryptrService } from '../utils/cryptr.service';

@Injectable()
export class CredentialsService {
  private SALT = 10;
  private ITERATIONS = 10000;
  private cryptr: Cryptr;

  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptrService: CryptrService,
  ) {}

  private getCryptrInstance(): Cryptr {
    if (!this.cryptr) {
      this.cryptr = new Cryptr(process.env.JWT_SECRET, {
        pbkdf2Iterations: this.ITERATIONS,
        saltLength: this.SALT,
      });
    }
    return this.cryptr;
  }

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
      throw new UnauthorizedException('Not owner of credential!');

    const cryptr = this.getCryptrInstance();
    const decryptedPass = cryptr.decrypt(credential.password);
    return { ...credential, password: decryptedPass };
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
