import * as sgMail from '@sendgrid/mail';

const sendAccountConfirmationRequest = (email: string, userName: string, token: string): void => {
  const { NODE_ENV, SENDGRID_API_KEY } = process.env;

  // TODO: prepare production version when FE will be ready
  const baseUrl: string = 'http://localhost:8080';

  sgMail.setApiKey(SENDGRID_API_KEY);

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

  // tslint:disable-next-line no-console
  sgMail.send(msg).catch(err => console.log(err));
};

export default sendAccountConfirmationRequest;
