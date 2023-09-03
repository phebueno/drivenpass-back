import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

@Injectable()
export class CryptrService {
  private readonly cryptr: Cryptr;

  constructor() {
    const JWT_SECRET = process.env.JWT_SECRET || 'chaveSecretaPadrao';
    const SALT = 10;
    const ITERATIONS = 10000;

    this.cryptr = new Cryptr(JWT_SECRET, {
      pbkdf2Iterations: ITERATIONS,
      saltLength: SALT,
    });
  }

  getCryptrInstance(): Cryptr {
    return this.cryptr;
  }
}