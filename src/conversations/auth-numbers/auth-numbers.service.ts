import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthNumbers } from '../schemas/authorized-numbers.schema';
@Injectable()
export class AuthNumbersService {
  constructor(
    @InjectModel(AuthNumbers.name)
    private authNumbersModel: Model<AuthNumbers>,
  ) {}

  async numberExists(query: string): Promise<AuthNumbers[]> {
    return this.authNumbersModel.findOne({ number: query });
  }
}
