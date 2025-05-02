const twilio = require('twilio');

// Function to send WhatsApp notification to admin
const sendWhatsAppNotification = async (appointment) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const date = new Date(appointment.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const servicesList = appointment.services
      .map(service => service.name)
      .join(', ');

    const message = `
      El cliente ${appointment.client.name} con número ${appointment.client.phone} ha agendado una cita para el día ${formattedDate} a las ${appointment.time} y solicitó los siguientes servicios: ${servicesList}. Total: $${appointment.totalPrice}.
    `;

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
    });

    console.log('WhatsApp notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

// Function to send cancellation notification
const sendCancellationNotification = async (appointment) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const date = new Date(appointment.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const message = `
      Su cita para el ${formattedDate} a las ${appointment.time} en La Barbería ha sido cancelada. Para reagendar, contáctenos.
    `;

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${appointment.client.phone}`
    });

    console.log('Cancellation notification sent');
    return true;
  } catch (error) {
    console.error('Error sending cancellation notification:', error);
    return false;
  }
};

module.exports = { 
  sendWhatsAppNotification,
  sendCancellationNotification
};