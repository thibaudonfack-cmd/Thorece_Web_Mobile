package cipestudio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);

        try{
            mailSender.send(message);
            System.out.println("Email Sent to: " + toEmail+ " Subject: " + subject+ " Body: " + body);
        }catch(Exception e){
            System.out.println("Impossible d'envoyer l'email. : " + e.getMessage()+ " "+ body);
        }

    }
}
