import { Module } from '@nestjs/common';
import { ProducerService } from '../services/kafka/producer.service';
import { ConsumerService } from '../services/kafka/consumer.service';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
