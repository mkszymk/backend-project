import TicketDTO from "../../dao/DTOs/ticket.dto.js";
import { ticketsModel } from "../../dao/models/tickets.model.js";
import crypto from "crypto";

export default class TicketManager {
  async createTicket(amount, purchaser) {
    const code =
      new Date()
        .toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replaceAll("/", "") +
      crypto.randomBytes(6).toString("hex").toUpperCase();

    const purchase_datetime = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const ticket = new TicketDTO({
      code,
      purchase_datetime,
      amount,
      purchaser,
    });
    try {
      const mongoResponse = await ticketsModel.create(ticket.get());
      return {
        success: true,
        message: "New ticked created.",
        ticketCode: code,
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }

  async getTicketByCode(code) {
    const ticket = await ticketsModel.findOne({ code }).lean();
    if (!ticket) return { success: false, error: 404 };
    return { success: true, ticket };
  }
}
