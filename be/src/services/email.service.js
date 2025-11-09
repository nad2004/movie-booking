import sgMail from "@sendgrid/mail";

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log("SendGrid initialized");
    } else {
      console.warn("SendGrid API key not found");
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: "Chào mừng đến với Cinema Booking",
        html: this.getWelcomeEmailTemplate(user),
      };

      await sgMail.send(msg);
      console.log(`Welcome email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send welcome email error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation(booking, user) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: `Xác nhận đặt vé - ${booking.movieTitle}`,
        html: this.getBookingConfirmationTemplate(booking, user),
        attachments: [
          {
            content: booking.qrCode.split("base64,")[1], // Extract base64 content
            filename: `ticket-${booking.bookingCode}.png`,
            type: "image/png",
            disposition: "attachment",
          },
        ],
      };

      await sgMail.send(msg);
      console.log(`Booking confirmation sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send booking confirmation error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send booking reminder (24h before show)
  async sendBookingReminder(booking, user) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: `Nhắc nhở: Suất chiếu ${booking.movieTitle} sắp diễn ra`,
        html: this.getBookingReminderTemplate(booking, user),
      };

      await sgMail.send(msg);
      console.log(`Booking reminder sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send booking reminder error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send cancellation email
  async sendCancellationEmail(booking, user, refundAmount) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: `Đã hủy vé - ${booking.movieTitle}`,
        html: this.getCancellationEmailTemplate(booking, user, refundAmount),
      };

      await sgMail.send(msg);
      console.log(`Cancellation email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send cancellation email error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: "Đặt lại mật khẩu",
        html: this.getPasswordResetTemplate(user, resetUrl),
      };

      await sgMail.send(msg);
      console.log(`Password reset email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send password reset email error:", error);
      return { success: false, error: error.message };
    }
  }

  // Send promotional email
  async sendPromotionalEmail(user, promotion) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@cinema.com",
        subject: promotion.subject,
        html: this.getPromotionalEmailTemplate(user, promotion),
      };

      await sgMail.send(msg);
      console.log(`Promotional email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error("Send promotional email error:", error);
      return { success: false, error: error.message };
    }
  }

  // Email Templates
  getWelcomeEmailTemplate(user) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎬 Chào mừng đến với Cinema Booking</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại Cinema Booking!</p>
                        <p>Bạn hiện đang là thành viên <strong>${user.membershipLevel}</strong> với <strong>${user.loyaltyPoints}</strong> điểm tích lũy.</p>
                        <p>Hãy bắt đầu trải nghiệm đặt vé xem phim dễ dàng và nhanh chóng:</p>
                        <a href="${process.env.FRONTEND_URL}/movies" class="button">Khám phá phim mới</a>
                        <h3>🎁 Ưu đãi dành cho bạn:</h3>
                        <ul>
                            <li>Giảm 20% cho lần đặt vé đầu tiên</li>
                            <li>Tích điểm mỗi lần đặt vé</li>
                            <li>Ưu đãi đặc biệt cho thành viên VIP</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>© 2024 Cinema Booking. All rights reserved.</p>
                        <p>Email: support@cinema.com | Hotline: 1900-xxxx</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  getBookingConfirmationTemplate(booking, user) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .booking-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .qr-code { text-align: center; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    .highlight { color: #4CAF50; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Đặt vé thành công!</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt vé tại Cinema Booking. Đây là thông tin vé của bạn:</p>
                        
                        <div class="booking-info">
                            <h2>${booking.movieTitle}</h2>
                            <div class="info-row">
                                <span>Mã đặt vé:</span>
                                <span class="highlight">${booking.bookingCode}</span>
                            </div>
                            <div class="info-row">
                                <span>Rạp:</span>
                                <span>${booking.theaterName}</span>
                            </div>
                            <div class="info-row">
                                <span>Phòng:</span>
                                <span>${booking.roomName}</span>
                            </div>
                            <div class="info-row">
                                <span>Suất chiếu:</span>
                                <span>${booking.showTime}</span>
                            </div>
                            <div class="info-row">
                                <span>Ghế:</span>
                                <span>${booking.seats.map((s) => s.seatNumber).join(", ")}</span>
                            </div>
                            <div class="info-row">
                                <span>Tổng tiền:</span>
                                <span class="highlight">${booking.totalAmount.toLocaleString("vi-VN")}đ</span>
                            </div>
                        </div>

                        <div class="qr-code">
                            <p><strong>Mã QR vé điện tử:</strong></p>
                            <img src="${booking.qrCode}" alt="QR Code" style="max-width: 200px;">
                            <p style="font-size: 12px; color: #666;">Vui lòng xuất trình mã này tại rạp</p>
                        </div>

                        <p><strong>Lưu ý:</strong></p>
                        <ul>
                            <li>Vui lòng đến rạp trước giờ chiếu 15 phút</li>
                            <li>Xuất trình mã QR để nhận vé</li>
                            <li>Liên hệ hotline nếu cần hỗ trợ</li>
                        </ul>

                        <p>Bạn đã tích được <strong>${Math.floor(booking.totalAmount / 10000)}</strong> điểm từ giao dịch này!</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Cinema Booking. All rights reserved.</p>
                        <p>Email: support@cinema.com | Hotline: 1900-xxxx</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  getBookingReminderTemplate(booking, user) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #FF9800; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .reminder-box { background: #fff3cd; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⏰ Nhắc nhở suất chiếu</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <div class="reminder-box">
                            <h3>Suất chiếu của bạn sắp bắt đầu!</h3>
                            <p><strong>${booking.movieTitle}</strong></p>
                            <p>Thời gian: ${booking.showTime}</p>
                            <p>Rạp: ${booking.theaterName} - ${booking.roomName}</p>
                            <p>Ghế: ${booking.seats.map((s) => s.seatNumber).join(", ")}</p>
                        </div>
                        <p>Vui lòng đến rạp trước giờ chiếu 15 phút để check-in.</p>
                        <p>Mã đặt vé: <strong>${booking.bookingCode}</strong></p>
                        <p>Chúc bạn xem phim vui vẻ! 🎬</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  getCancellationEmailTemplate(booking, user, refundAmount) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>❌ Vé đã được hủy</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <p>Vé của bạn đã được hủy thành công.</p>
                        <p><strong>Thông tin vé:</strong></p>
                        <ul>
                            <li>Mã đặt vé: ${booking.bookingCode}</li>
                            <li>Phim: ${booking.movieTitle}</li>
                            <li>Suất chiếu: ${booking.showTime}</li>
                        </ul>
                        <p><strong>Hoàn tiền:</strong> ${refundAmount.toLocaleString("vi-VN")}đ</p>
                        <p>Số tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc.</p>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  getPasswordResetTemplate(user, resetUrl) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2196F3; color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; padding: 12px 30px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Đặt lại mật khẩu</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Nhấn vào nút dưới đây để đặt lại mật khẩu:</p>
                        <p style="text-align: center;">
                            <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
                        </p>
                        <p>Link này sẽ hết hạn sau 1 giờ.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  getPromotionalEmailTemplate(user, promotion) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .promo-code { background: #fff; border: 2px dashed #f5576c; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #f5576c; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 ${promotion.title}</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${user.fullName}</strong>,</p>
                        <p>${promotion.description}</p>
                        ${
                          promotion.code
                            ? `
                            <div class="promo-code">
                                ${promotion.code}
                            </div>
                            <p style="text-align: center;">Sử dụng mã này khi đặt vé</p>
                        `
                            : ""
                        }
                        <p>${promotion.details}</p>
                        <p style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL}/movies" style="display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px;">Đặt vé ngay</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }
}

const emailService = new EmailService();
export default emailService;
