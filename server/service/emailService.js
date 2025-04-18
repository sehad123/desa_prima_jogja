const transporter = require('../config/emailConfig');

const sendWelcomeEmail = async (email, name, password) => {
  try {
    console.log("Mengirim email ke:", email);
    const info = await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Akun Anda Telah Dibuat',
      html: `
        <h1>Halo ${name}!</h1>
        <p>Password sementara Anda: <strong>${password}</strong></p>
        <p>Harap ganti password setelah login.</p>
      `
    });
    console.log("Email terkirim:", info.messageId); // Log 2
    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim email:", error); // Log 3
    return { success: false, error };
  }
};

module.exports = { sendWelcomeEmail };