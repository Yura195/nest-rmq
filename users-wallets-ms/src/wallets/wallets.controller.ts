import { State } from './enums/state.enum';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WalletsService } from './wallets.service';

@Controller()
export class WalletsController {
  constructor(private readonly _walletsService: WalletsService) {}

  @EventPattern('response-to-wallet-user')
  async upproveTransaction(
    @Payload() data: { state: State },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();

    channel.ack(orginalMessage);

    return this._walletsService.changeState(data.state);
  }
}
