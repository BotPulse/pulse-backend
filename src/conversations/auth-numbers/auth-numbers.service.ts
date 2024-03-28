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

  async addDuration(query: string, seconds: number): Promise<void> {
    const authNumber = await this.authNumbersModel.findOne({ number: query });
    if (authNumber) {
      const currentSeconds = authNumber.secondsDecoded;
      const newSeconds = !currentSeconds ? seconds : currentSeconds + seconds;
      await this.authNumbersModel.updateOne(
        { number: query },
        { secondsDecoded: newSeconds },
      );
    }
  }
  async numberExists(query: string): Promise<AuthNumbers[]> {
    return this.authNumbersModel.findOne({ number: query });
  }
}
