const nodemailer = require('nodemailer');
const sendEmail = require('../utils/emailService'); // Adjust the path as necessary
const testemail = process.env.TEST_EMAIL

// Mock nodemailer
jest.mock('nodemailer');

const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
});

describe('emailService', () => {
    beforeEach(() => {
        sendMailMock.mockClear();
        nodemailer.createTransport.mockClear();
    });

    it('should send an email using nodemailer', async () => {
        await sendEmail({
            email: testemail,
            subject: 'Test Subject',
            message: 'Test message',
            html: '<p>Test message</p>',
        });

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: expect.any(String),
            to: testemail,
            subject: 'Test Subject',
            text: 'Test message',
            html: '<p>Test message</p>',
        }));
    });
});
