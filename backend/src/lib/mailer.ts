import nodemailer from 'nodemailer';
import { prisma as prismaClient } from './prisma.js';

const prisma = prismaClient as any;

// Helper to format currency
const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Send order confirmation email to user and order alert email to admin
 */
export async function sendOrderEmails(orderId: string): Promise<void> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpSecure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@stevejon.com';

    // If SMTP variables are missing, log warnings and bypass
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        '⚠️ Mailer: SMTP configuration is incomplete (SMTP_HOST, SMTP_USER, or SMTP_PASS is missing in .env).'
      );
      console.log('Skipping email notifications for Order ID:', orderId);
      return;
    }

    // Fetch order with user and items details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: true,
                options: {
                  include: {
                    attribute: true,
                    attributeValue: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      console.error(`❌ Mailer error: Order ${orderId} not found in database.`);
      return;
    }

    // SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Support contact info from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stevejon.com';
    const adminSupportName = process.env.ADMIN_SUPPORT_NAME || 'Stevejon Support';
    const adminSupportEmail = process.env.ADMIN_SUPPORT_EMAIL || 'support@stevejon.com';
    const adminSupportPhone = process.env.ADMIN_SUPPORT_PHONE || '+1234567890';
    const adminSupportAddress = process.env.ADMIN_SUPPORT_ADDRESS || '123 Main St, New York, NY';

    // Prepare items tables HTML
    let itemsHtml = '';
    order.items.forEach((item: any) => {
      const optionStrings = item.variant.options.map(
        (opt: any) => `${opt.attribute.name}: ${opt.attributeValue.value}`
      );
      const optionsText = optionStrings.length > 0 ? ` (${optionStrings.join(', ')})` : '';
      const itemName = `${item.variant.product.name}${optionsText}`;
      const itemSku = item.variant.sku || 'N/A';

      itemsHtml += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 600; color: #0f172a;">${itemName}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">SKU: ${itemSku}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #475569;">${formatCurrency(item.price)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `;
    });

    // Subtotal calculation
    const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Build user email body
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - ${adminSupportName}</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Order Confirmed!</h1>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">Thank you for shopping with us. Your order is processing.</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 8px;">Hello ${order.user.name || 'Customer'},</p>
            <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
              Your order has been received and is currently being processed. Here are the details of your transaction:
            </p>
            
            <!-- Order Meta -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Order ID:</td>
                  <td style="padding: 4px 0; text-align: right; color: #0f172a; font-weight: 700;">${order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Date:</td>
                  <td style="padding: 4px 0; text-align: right; color: #0f172a; font-weight: 600;">${new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Payment Method:</td>
                  <td style="padding: 4px 0; text-align: right; color: #0f172a; font-weight: 600;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Order Status:</td>
                  <td style="padding: 4px 0; text-align: right; color: #059669; font-weight: 700;">${order.status}</td>
                </tr>
              </table>
            </div>
            
            <!-- Items Table -->
            <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">Items Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Product</th>
                  <th style="text-align: center; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Qty</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Price</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Totals Section -->
            <table style="width: 250px; margin-left: auto; font-size: 14px; margin-bottom: 24px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Subtotal:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a;">${formatCurrency(subtotal)}</td>
              </tr>
              ${
                order.discountAmount > 0
                  ? `
              <tr>
                <td style="padding: 6px 0; color: #dc2626;">Discount (${order.couponCode || 'Coupon'}):</td>
                <td style="padding: 6px 0; text-align: right; color: #dc2626;">-${formatCurrency(order.discountAmount)}</td>
              </tr>
              `
                  : ''
              }
              <tr style="border-top: 2px solid #e2e8f0; font-weight: 700; font-size: 16px;">
                <td style="padding: 12px 0 0 0; color: #0f172a;">Total:</td>
                <td style="padding: 12px 0 0 0; text-align: right; color: #0f172a;">${formatCurrency(order.totalAmount)}</td>
              </tr>
            </table>
            
            <!-- Shipping Details -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 8px;">Shipping Address</h4>
              <div style="font-size: 14px; line-height: 1.5; color: #475569;">
                <strong>${order.user.name}</strong><br>
                ${order.street}<br>
                ${order.city}, ${order.state} - ${order.pincode}<br>
                Phone: ${order.phoneNumber}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #0f172a; color: #94a3b8; padding: 32px 24px; font-size: 13px; text-align: center;">
            <p style="margin: 0 0 16px 0;">If you have any questions, feel free to reply directly to this email or reach us using the details below.</p>
            <div style="border-top: 1px solid #334155; margin-top: 16px; padding-top: 16px; font-size: 12px; line-height: 1.6; color: #64748b;">
              <strong style="color: #ffffff;">${adminSupportName}</strong><br>
              Email: <a href="mailto:${adminSupportEmail}" style="color: #38bdf8; text-decoration: none;">${adminSupportEmail}</a> | Phone: ${adminSupportPhone}<br>
              ${adminSupportAddress}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Build admin email body
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Alert - Order #${order.id}</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <div style="background-color: #dc2626; padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">New Order Placed!</h1>
            <p style="margin: 8px 0 0 0; color: #fecaca; font-size: 14px;">Order #${order.id} has been received in the system.</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">Customer Details</h3>
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500; width: 120px;">Name:</td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${order.user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Email:</td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${order.user.email}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Phone Number:</td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${order.user.phone || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <!-- Items Table -->
            <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Product</th>
                  <th style="text-align: center; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Qty</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Price</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Totals Section -->
            <table style="width: 250px; margin-left: auto; font-size: 14px; margin-bottom: 24px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Subtotal:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a;">${formatCurrency(subtotal)}</td>
              </tr>
              ${
                order.discountAmount > 0
                  ? `
              <tr>
                <td style="padding: 6px 0; color: #dc2626;">Discount:</td>
                <td style="padding: 6px 0; text-align: right; color: #dc2626;">-${formatCurrency(order.discountAmount)} (${order.couponCode})</td>
              </tr>
              `
                  : ''
              }
              <tr style="border-top: 2px solid #e2e8f0; font-weight: 700; font-size: 16px;">
                <td style="padding: 12px 0 0 0; color: #0f172a;">Grand Total:</td>
                <td style="padding: 12px 0 0 0; text-align: right; color: #0f172a;">${formatCurrency(order.totalAmount)}</td>
              </tr>
            </table>
            
            <!-- Shipping Details -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 8px;">Delivery & Contact Details</h4>
              <div style="font-size: 14px; line-height: 1.5; color: #475569;">
                <strong>Street:</strong> ${order.street}<br>
                <strong>City/State/Pincode:</strong> ${order.city}, ${order.state} - ${order.pincode}<br>
                <strong>Shipping Phone:</strong> ${order.phoneNumber}<br>
                <strong>Payment Method:</strong> ${order.paymentMethod}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #0f172a; color: #94a3b8; padding: 24px; font-size: 12px; text-align: center;">
            <p style="margin: 0;">This is an automated administrative notification. Order ID: ${order.id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Send Order Confirmation Email to User
    if (order.user.email) {
      console.log(`✉️ Mailer: Sending confirmation email to user: ${order.user.email}`);
      await transporter.sendMail({
        from: smtpFromEmail,
        to: order.user.email,
        subject: `Order Confirmation - Order #${order.id}`,
        html: userEmailHtml,
      });
      console.log(`✅ Mailer: Confirmation email sent successfully to ${order.user.email}`);
    } else {
      console.warn(`⚠️ Mailer: User email is not defined for order ${order.id}. Skipping user email.`);
    }

    // 2. Send Order Alert Email to Admin
    if (adminEmail) {
      console.log(`✉️ Mailer: Sending new order notification to admin: ${adminEmail}`);
      await transporter.sendMail({
        from: smtpFromEmail,
        to: adminEmail,
        subject: `[NEW ORDER ALERT] Order #${order.id} - ${order.user.name}`,
        html: adminEmailHtml,
      });
      console.log(`✅ Mailer: Admin alert email sent successfully to ${adminEmail}`);
    } else {
      console.warn('⚠️ Mailer: adminEmail address is not configured. Skipping admin alert email.');
    }
  } catch (error) {
    console.error('❌ Mailer execution failed:', error);
  }
}
