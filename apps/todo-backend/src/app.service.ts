import { apiVersions } from '#main';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  listVersions() {
    return apiVersions;
  }
}
