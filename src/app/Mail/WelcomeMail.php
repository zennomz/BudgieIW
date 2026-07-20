<?php

namespace App\Mail;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

function confirmAccountMail($sendTo, $token)
{
    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();
        $mail->Timeout = 5;
        $mail->SMTPKeepAlive = false;

        $mail->Host = env('MAIL_HOST', 'smtp.resend.com');
        $mail->Port = env('MAIL_PORT', 587);
        $mail->SMTPAuth = true;
        $mail->Username = env('MAIL_USERNAME');
        $mail->Password = env('MAIL_PASSWORD');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $appUrl = env('APP_URL', 'https://my-budgie.fr');
        $link = $appUrl . "/verify?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>Veuillez confirmer votre inscription en cliquant ici : <a href='$link'>Confirmer mon compte</a>";
        $mail->setFrom(env('MAIL_FROM_ADDRESS', 'noreply@my-budgie.fr'), 'Budgie');
        $mail->Subject = 'Confirmation de votre inscription';
        $mail->addAddress($sendTo);
        $mail->Body = $body;
        $mail->isHTML(true);

        $mail->send();

        return "Succes : Mail envoyé";

    } catch (PHPMailerException $e) {

        return "Erreur :" . $e->getMessage();

    }
}

function resetPasswordMail($sendTo, $token)
{

    $mail = new PHPMailer(true);

    try {

        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();

        $mail->Host = env('MAIL_HOST', 'smtp.resend.com');
        $mail->Port = env('MAIL_PORT', 587);
        $mail->SMTPAuth = true;
        $mail->Username = env('MAIL_USERNAME');
        $mail->Password = env('MAIL_PASSWORD');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $appUrl = env('APP_URL', 'https://my-budgie.fr');
        $link = $appUrl . "/reset_password?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien suivant pour créer un nouveau mot de passe : <a href='$link'>Réinitialiser mon mot de passe</a><br><br>Si vous n'avez pas fait cette demande, ignorez cet email.";

        $mail->setFrom(env('MAIL_FROM_ADDRESS', 'noreply@my-budgie.fr'), 'Budgie');
        $mail->Subject = 'Réinitialisation de votre mot de passe';
        $mail->addAddress($sendTo);
        $mail->Body = $body;
        $mail->isHTML(true);

        $mail->send();

        return "Succes : Mail envoyé";

    } catch (PHPMailerException $e) {

        return "Erreur :" . $e->getMessage();

    }
}


function shareAccountMail($sendTo, $accountName, $ownerName, $token)
{
    $mail = new PHPMailer(true);

    try {

        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();
        $mail->Timeout = 5;
        $mail->SMTPKeepAlive = false;

        $mail->Host = env('MAIL_HOST', 'smtp.resend.com');
        $mail->Port = env('MAIL_PORT', 587);
        $mail->SMTPAuth = true;
        $mail->Username = env('MAIL_USERNAME');
        $mail->Password = env('MAIL_PASSWORD');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $appUrl = env('APP_URL', 'https://my-budgie.fr');
        $link = $appUrl . "/partages/accepter?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>$ownerName souhaite partager avec vous la visibilité (lecture seule) de son compte <strong>$accountName</strong> sur Budgie.<br><br>Cliquez ici pour accepter l'invitation : <a href='$link'>Accepter le partage</a><br><br>Si vous ne connaissez pas cette personne, ignorez cet email.";

        $mail->setFrom(env('MAIL_FROM_ADDRESS', 'noreply@my-budgie.fr'), 'Budgie');
        $mail->Subject = 'Invitation à partager un compte Budgie';
        $mail->addAddress($sendTo);
        $mail->Body = $body;
        $mail->isHTML(true);

        $mail->send();

        return "Succes : Mail envoyé";

    } catch (PHPMailerException $e) {

        return "Erreur :" . $e->getMessage();

    }
}
