import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Status } from '../schemas/statuses.schema';
import { CreateMessageStatusDto } from '../dto/create-status.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectModel(Status.name)
    private statusesModel: Model<Status>,
  ) {}

  async createOrUpdate(createStatus: CreateMessageStatusDto): Promise<Status> {
    const existingStatus = await this.statusesModel.findOne({
      id: createStatus.id,
    });
    if (existingStatus) {
      existingStatus.status = createStatus.status;
      existingStatus.timestamp = createStatus.timestamp;
      return existingStatus.save();
    } else {
      const createdStatus = new this.statusesModel(createStatus);
      return createdStatus.save();
    }
  }
}
