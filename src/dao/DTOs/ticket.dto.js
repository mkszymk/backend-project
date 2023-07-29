export default class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
  }
  get() {
    return {
      code: this.code,
      purchase_datetime: this.purchase_datetime,
      amount: this.amount,
      purchaser: this.purchaser,
    };
  }
}
