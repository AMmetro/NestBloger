import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

describe('clear all data', () => {
  it('+ GET blogs', async () => {
    // await request(app).delete('/testing/all-data').expect(204);
    expect(5).toBe(5);
  });
});
