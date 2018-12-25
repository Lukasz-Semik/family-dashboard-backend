import * as sgMail from '@sendgrid/mail';

// TODO: make emails prettier when FE will be ready
// TODO: prepare production version when FE will be ready
const baseUrl: string = 'http://localhost:8080';

const setApiKey = () => {
  const { SENDGRID_API_KEY } = process.env;
  sgMail.setApiKey(SENDGRID_API_KEY);
};

const sendEmail = msg => {
  if (process.env.NODE_ENV !== 'test')
    // tslint:disable-next-line no-console
    sgMail.send(msg).catch(err => console.log(err));
};

export const sendAccountConfirmationEmail = (
  email: string,
  userName: string,
  token: string
): void => {
  setApiKey();

  const msg = {
    to: email,
    from: 'family-dashboard@support.com',
    subject: 'Family Dashboard - account confirmation',
    html: `
      <h3>Hello ${userName}</h3>
      <p>
        Please confirm your account by visiting
        <a href='${baseUrl}/confirm?token=${token}' target="_blank">
          this page
        </a>
      </p>
    `,
  };

  sendEmail(msg);
};

export const sendInvitationEmail = (
  email: string,
  invitedUserName: string,
  invitingUserName: string,
  familyName: string,
  token: string
): void => {
  setApiKey();

  const msg = {
    to: email,
    from: 'family-dashboard@support.com',
    subject: 'Family Dashboard - account confirmation',
    html: `
      <h3>Hello ${invitedUserName}</h3>
      <p>
        You have been invited to join the ${familyName} family by ${invitingUserName}.
        Please confirm your account by visiting
        <a href='${baseUrl}/confirm?token=${token}' target="_blank">
          this page
        </a>
      </p>
    `,
  };

  sendEmail(msg);
};

export const sendAddUserToFamilyEmail = (
  email: string,
  invitedUserName: string,
  invitingUserName: string,
  familyName: string,
  token: string
): void => {
  setApiKey();

  const msg = {
    to: email,
    from: 'family-dashboard@support.com',
    subject: 'Family Dashboard - invitation to join family',
    html: `
      <h3>Hello ${invitedUserName}</h3>
      <p>
        You have been invited to join the ${familyName} family by ${invitingUserName}.
        If you want to joint this family, please confirm by visiting
        <a href='${baseUrl}/confirm?token=${token}' target="_blank">
          this page
        </a>
      </p>
    `,
  };

  sendEmail(msg);
};

export const sendResetPasswordEdmail = (email: string, userName: string, token: string): void => {
  setApiKey();

  const msg = {
    to: email,
    from: 'family-dashboard@support.com',
    subject: 'Family Dashboard - reset email request',
    html: `
      <h3>Hello ${userName}</h3>
      <p>
        To reset password, go to this link:

        <a href='${baseUrl}/confirm?token=${token}' target="_blank">
          this page
        </a>
      </p>
    `,
  };

  sendEmail(msg);
};
