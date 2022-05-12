export class CreateTransferDto {
  readonly amount: number;
  readonly description: string;
  readonly to: string;
  readonly from: string;
}
