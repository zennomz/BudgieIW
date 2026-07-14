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

        $mail->Host = "mailhog";
        $mail->Port = "1025";
        $mail->SMTPAuth = false;
        $link = APP_URL . "/verify?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>Veuillez confirmer votre inscription en cliquant ici : <a href='$link'>Confirmer mon compte</a>";
        $mail->setFrom("noreply@budgie.com", "Budgie");
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

function shareAccountMail($sendTo, $accountName, $ownerName, $token)
{
    $mail = new PHPMailer(true);

    try {

        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();
        $mail->Timeout = 5;
        $mail->SMTPKeepAlive = false;

        $mail->Host = "mailhog";
        $mail->Port = "1025";
        $mail->SMTPAuth = false;

        $link = config('app.url') . "/partages/accepter?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>$ownerName souhaite partager avec vous la visibilité (lecture seule) de son compte <strong>$accountName</strong> sur Budgie.<br><br>Cliquez ici pour accepter l'invitation : <a href='$link'>Accepter le partage</a><br><br>Si vous ne connaissez pas cette personne, ignorez cet email.";

        $mail->setFrom("noreply@budgie.com", "Budgie");
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

function resetPasswordMail($sendTo, $token)
{

    $mail = new PHPMailer(true);

    try {

        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();

        $mail->Host = "mailhog";
        $mail->Port = "1025";
        $mail->SMTPAuth = false;

        $link = APP_URL . "/reset_password?email=" . urlencode($sendTo) . "&token=" . urlencode($token);
        $body = "Bonjour,<br>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien suivant pour créer un nouveau mot de passe : <a href='$link'>Réinitialiser mon mot de passe</a><br><br>Si vous n'avez pas fait cette demande, ignorez cet email.";

        $mail->setFrom("noreply@budgie.com", "Budgie");
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