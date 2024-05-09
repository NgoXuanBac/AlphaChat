package com.alphachat.api.service;

import com.alphachat.api.constant.Constant;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@RequiredArgsConstructor
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    
    public void sendConfirmRegister(String toAddress, String code)
            throws MessagingException, UnsupportedEncodingException {

        String fromAddress = "ngobac20031016@gmail.com";
        String senderName = "Alpha Chat";
        String subject = "Please verify your registration";
        String content =  "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_blank\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + senderName;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[URL]]", Constant.ALLOWED_ORIGIN+"/verify?token="+code);

        helper.setText(content, true);
        mailSender.send(message);
    }

    public void sendConfirmReset(String toAddress, String code)
            throws MessagingException, UnsupportedEncodingException {

        String fromAddress = "ngobac20031016@gmail.com";
        String senderName = "Alpha Chat";
        String subject = "Please verify your reset password";
        String content = "Please click the link below to reset your password:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_blank\">RESET PASSWORD</a></h3>"
                + "Thank you,<br>"
                + senderName;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[URL]]", Constant.ALLOWED_ORIGIN+"/forgotpassword/verify?token="+code);

        helper.setText(content, true);
        mailSender.send(message);
    }
}
