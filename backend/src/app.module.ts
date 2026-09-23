import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ElevatorService } from './services/elevator.service.js';
import { ElevatorGateway } from './gateways/elevator.gateway.js';
import { SimulatorService } from './services/simulator.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,
    ElevatorService,
    ElevatorGateway,
    SimulatorService,
  ],
})
export class AppModule { }
