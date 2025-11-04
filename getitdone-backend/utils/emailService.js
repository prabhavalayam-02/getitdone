const nodemailer = require('nodemailer');

// Create transporter (optional - allows server to start without email config)
let transporter = null;
let emailConfigError = null;

try {
  console.log('🔧 Initializing email service...');
  console.log('EMAIL_USER present:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD present:', !!process.env.EMAIL_PASSWORD);
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    // Use direct SMTP configuration for better compatibility with cloud servers
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' ? true : false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add timeout and connection options to prevent hanging
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      pool: false, // Disable pooling for better error handling
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5,
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates (for cloud servers)
      }
    });
    
    console.log('✅ Email service configured');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔐 Email Password length:', process.env.EMAIL_PASSWORD?.length);
    
    // Test connection with timeout (don't await, just log results)
    const verificationTimeout = setTimeout(() => {
      console.warn('⚠️  Email verification taking longer than expected. Will continue anyway...');
    }, 5000);
    
    transporter.verify((error, success) => {
      clearTimeout(verificationTimeout);
      if (error) {
        console.error('❌ Email service verification failed:', error.message);
        console.error('⚠️  Email service may not work, but API will continue');
        console.error('💡 Tip: Gmail often blocks cloud servers. Consider using SendGrid or Mailgun');
        emailConfigError = error.message;
        // Don't set transporter to null - let it try to send anyway
      } else {
        console.log('✅ Email service verified and ready');
      }
    });
  } else {
    console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize email service:', error.message);
  console.error('Full error:', error);
  emailConfigError = error.message;
}

/**
 * Send email when helper accepts a task
 * @param {Object} task - Task object
 * @param {Object} helper - Helper object
 * @param {Object} tasker - Tasker (creator) object
 */
const sendTaskAcceptedEmail = async (task, helper, tasker) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return { success: false, reason: 'Email not configured' };
  }
  
  console.log('📧 Sending task accepted email to:', tasker.email);
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const approveUrl = `${frontendUrl}/user/approve-helper/${task._id}`;
    const rejectUrl = `${frontendUrl}/user/reject-helper/${task._id}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tasker.email,
      subject: `Helper Request for Task: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Helper Request for Your Task!</h2>
          <p>A helper wants to work on your task and is awaiting your approval.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Details:</h3>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Budget:</strong> ₹${task.budget}</p>
            <p><strong>Location:</strong> ${task.location}</p>
          </div>
          
          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Helper Information:</h3>
            <p><strong>Name:</strong> ${helper.name}</p>
            <p><strong>Email:</strong> ${helper.email}</p>
            <p><strong>Phone:</strong> ${helper.phone || 'Not provided'}</p>
            <p><strong>Completed Tasks:</strong> ${helper.completedTasks || 0}</p>
            ${helper.rating > 0 ? `<p><strong>Rating:</strong> ⭐ ${helper.rating.toFixed(1)}/5.0 (${helper.totalRatings || 0} reviews)</p>` : '<p><strong>Rating:</strong> New helper (no ratings yet)</p>'}
            ${helper.rating > 0 ? `<div style="margin-top: 15px;"><a href="${frontendUrl}/reviews/helper/${helper._id}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">📝 See Ratings and Reviews</a></div>` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Action Required:</h3>
            <p>Please review the helper's profile and decide whether to approve or reject this request.</p>
            <div style="margin-top: 20px; text-align: center;">
              <a href="${approveUrl}" style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">✓ Approve Helper</a>
              <a href="${rejectUrl}" style="display: inline-block; padding: 12px 30px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">✗ Reject</a>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">You can also manage this in your dashboard at GetItDone</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Task accepted email sent successfully to:', tasker.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending task accepted email:', error.message);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    // Don't throw - let the request continue even if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send email when helper completes a task
 * @param {Object} task - Task object
 * @param {Object} helper - Helper object
 * @param {Object} tasker - Tasker (creator) object
 */
const sendTaskCompletedEmail = async (task, helper, tasker) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return;
  }
  
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const rateUrl = `${frontendUrl}/user/rate-task/${task._id}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tasker.email,
      subject: `Task Completed: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Task Completed!</h2>
          <p>Great news! Your task has been marked as completed by the helper.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Details:</h3>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Budget:</strong> ₹${task.budget}</p>
            <p><strong>Location:</strong> ${task.location}</p>
          </div>
          
          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Helper Information:</h3>
            <p><strong>Name:</strong> ${helper.name}</p>
            <p><strong>Email:</strong> ${helper.email}</p>
            <p><strong>Phone:</strong> ${helper.phone || 'Not provided'}</p>
            ${helper.rating > 0 ? `<p><strong>Current Rating:</strong> ⭐ ${helper.rating.toFixed(1)}/5.0</p>` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📝 Rate Your Helper</h3>
            <p>Help us maintain quality! Share your experience with this helper.</p>
            <p><strong>Your feedback will:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Help other users find reliable helpers</li>
              <li>Encourage helpers to maintain high standards</li>
              <li>Improve our community</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${rateUrl}" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">⭐ Rate Helper Now</a>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Task completed email sent successfully');
  } catch (error) {
    console.error('Error sending task completed email:', error);
    throw error;
  }
};

/**
 * Send email for subscription reminder
 * @param {Object} helper - Helper object
 */
const sendSubscriptionReminderEmail = async (helper) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return;
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: helper.email,
      subject: 'Free Trial Ending - Subscribe to Continue',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Free Trial Ending Soon!</h2>
          <p>Hi ${helper.name},</p>
          
          <p>You've completed ${helper.subscription.trialTasksCompleted} out of ${helper.subscription.trialTasksLimit} free trial tasks.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Subscribe to Continue</h3>
            <p>To continue accepting and completing tasks, please subscribe to one of our plans:</p>
            <ul>
              <li><strong>Monthly Plan:</strong> ₹99/month</li>
              <li><strong>Yearly Plan:</strong> ₹999/year (Save ₹189!)</li>
            </ul>
          </div>
          
          <p>Click the link below to choose your plan:</p>
          <a href="${process.env.FRONTEND_URL}/helper/subscription" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Subscription Plans
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Subscription reminder email sent successfully');
  } catch (error) {
    console.error('Error sending subscription reminder email:', error);
    throw error;
  }
};

/**
 * Send email when tasker approves a helper
 * @param {Object} task - Task object
 * @param {Object} helper - Helper object
 * @param {Object} tasker - Tasker (creator) object
 */
const sendHelperApprovedEmail = async (task, helper, tasker) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return;
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: helper.email,
      subject: `Congratulations! You've been approved for: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🎉 You've Been Approved!</h2>
          <p>Great news, ${helper.name}! The task owner has approved your request.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Details:</h3>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Budget:</strong> ₹${task.budget}</p>
            <p><strong>Location:</strong> ${task.location}</p>
          </div>
          
          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Owner Contact:</h3>
            <p><strong>Name:</strong> ${tasker.name}</p>
            <p><strong>Email:</strong> ${tasker.email}</p>
            <p><strong>Phone:</strong> ${tasker.phone || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Next Steps:</h3>
            <p>✓ The task has automatically started and is now in your "My Tasks" section</p>
            <p>✓ Contact the task owner to coordinate the work</p>
            <p>✓ Complete the task and mark it as done when finished</p>
            <p>✓ You'll earn ₹${task.budget} upon completion!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/helper/my-tasks" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">View My Tasks</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Helper approved email sent successfully');
  } catch (error) {
    console.error('Error sending helper approved email:', error);
    throw error;
  }
};

/**
 * Send email when tasker rejects a helper
 * @param {Object} task - Task object
 * @param {Object} helper - Helper object
 * @param {Object} tasker - Tasker (creator) object
 */
const sendHelperRejectedEmail = async (task, helper, tasker) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return;
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: helper.email,
      subject: `Task Request Not Approved: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Request Not Approved</h2>
          <p>Hi ${helper.name},</p>
          <p>Unfortunately, the task owner has decided not to proceed with your request for this task.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Details:</h3>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Budget:</strong> ₹${task.budget}</p>
            <p><strong>Location:</strong> ${task.location}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Don't Worry!</h3>
            <p>There are plenty of other opportunities available. Keep these in mind:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>The task is now available for other helpers</li>
              <li>Check out other open tasks that match your skills</li>
              <li>Building a strong profile with good ratings helps you get approved faster</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/helper" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Available Tasks</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Helper rejected email sent successfully');
  } catch (error) {
    console.error('Error sending helper rejected email:', error);
    throw error;
  }
};

/**
 * Send email to helper when task is completed
 * @param {Object} task - Task object
 * @param {Object} helper - Helper object
 * @param {Object} tasker - Tasker (creator) object
 */
const sendTaskCompletedEmailToHelper = async (task, helper, tasker) => {
  if (!transporter) {
    console.log('📧 Email notification skipped (email not configured)');
    return;
  }
  
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const rateUrl = `${frontendUrl}/helper/rate-tasker/${task._id}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: helper.email,
      subject: `Task Completed: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Task Completed!</h2>
          <p>Congratulations, ${helper.name}! You've successfully completed a task.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Details:</h3>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Budget:</strong> ₹${task.budget}</p>
            <p><strong>Location:</strong> ${task.location}</p>
          </div>
          
          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Task Owner Information:</h3>
            <p><strong>Name:</strong> ${tasker.name}</p>
            <p><strong>Email:</strong> ${tasker.email}</p>
            <p><strong>Phone:</strong> ${tasker.phone || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💰 Payment</h3>
            <p>You've earned <strong>₹${task.budget}</strong> for completing this task!</p>
            <p style="font-size: 14px; color: #6b7280;">Payment will be processed according to your subscription plan.</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📝 Rate the Task Owner</h3>
            <p>Help us maintain quality! Share your experience working with this task owner.</p>
            <p><strong>Your feedback will:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Help other helpers know what to expect</li>
              <li>Encourage task owners to provide clear requirements</li>
              <li>Improve our community</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${rateUrl}" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">⭐ Rate Task Owner Now</a>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            GetItDone Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Task completed email sent to helper successfully');
  } catch (error) {
    console.error('Error sending task completed email to helper:', error);
    throw error;
  }
};

module.exports = {
  sendTaskAcceptedEmail,
  sendTaskCompletedEmail,
  sendSubscriptionReminderEmail,
  sendHelperApprovedEmail,
  sendHelperRejectedEmail,
  sendTaskCompletedEmailToHelper,
};
