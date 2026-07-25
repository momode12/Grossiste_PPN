import requests
from flask import current_app
from threading import Thread
import traceback
import time


def send_async_email_brevo(app, to_email, subject, html_content, retries=3, delay=5):
    """Envoi email via API Brevo avec gestion anti-spam"""
    with app.app_context():
        for attempt in range(1, retries + 1):
            try:
                current_app.logger.info(
                    f"[EMAIL] Tentative d'envoi email à {to_email} (Essai {attempt} sur {retries})"
                )

                api_key = app.config.get("BREVO_API_KEY")
                sender_email = app.config.get("MAIL_DEFAULT_SENDER")
                sender_name = app.config.get("MAIL_SENDER_NAME", "Vente PI")

                if not api_key:
                    current_app.logger.error("[EMAIL] ❌ BREVO_API_KEY manquante dans la config !")
                    return

                current_app.logger.info(
                    f"[EMAIL] Configuration API Brevo : sender={sender_email}"
                )

                payload = {
                    "sender": {
                        "name": sender_name,
                        "email": sender_email
                    },
                    "to": [{"email": to_email}],
                    "subject": subject,
                    "htmlContent": html_content,
                    "headers": {
                        "X-Entity-Ref-ID": f"vente-pi-{int(time.time())}"
                    },
                    "tags": ["account_notification"]
                }

                # Appel API Brevo
                response = requests.post(
                    "https://api.brevo.com/v3/smtp/email",
                    headers={
                        "accept": "application/json",
                        "api-key": api_key,
                        "content-type": "application/json"
                    },
                    json=payload,
                    timeout=30
                )

                if response.status_code in (200, 201):
                    data = response.json()
                    current_app.logger.info(
                        f"[EMAIL] ✅ Email envoyé avec succès (ID: {data.get('messageId')})"
                    )
                    break  # Sortie de la boucle si succès
                else:
                    current_app.logger.error(
                        f"[EMAIL] ❌ Erreur HTTP {response.status_code}: {response.text}"
                    )
                    if attempt < retries:
                        current_app.logger.info(
                            f"[EMAIL] Nouvelle tentative dans {delay} secondes..."
                        )
                        time.sleep(delay)
                    else:
                        current_app.logger.error(
                            "[EMAIL] Toutes les tentatives ont échoué. Abandon de l'envoi."
                        )

            except requests.exceptions.Timeout:
                current_app.logger.error(
                    f"[EMAIL] ❌ Timeout lors de la tentative {attempt}"
                )
                if attempt < retries:
                    time.sleep(delay)

            except requests.exceptions.RequestException as e:
                current_app.logger.error(
                    f"[EMAIL] ❌ Erreur réseau lors de la tentative {attempt} : {e}"
                )
                if attempt < retries:
                    time.sleep(delay)
                else:
                    current_app.logger.error("[EMAIL] Abandon après toutes les tentatives.")

            except Exception as e:
                current_app.logger.error(
                    f"[EMAIL] ❌ Exception inattendue lors de l'envoi de l'email : {e}"
                )
                current_app.logger.error(f"[EMAIL][TRACEBACK]\n{traceback.format_exc()}")
                break


def send_account_activated_email(user):
    """Email d'activation de compte avec HTML optimisé anti-spam"""
    frontend_url = current_app.config.get("FRONTEND_URL", "https://vente-pi.vercel.app/user")

    if not frontend_url or frontend_url == "":
        current_app.logger.warning("[EMAIL] ⚠️ FRONTEND_URL non configuré dans .env")
        frontend_url = "#"

    subject = "✅ Votre compte Vente PI est activé"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compte activé - Vente PI</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); border-radius: 12px 12px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                    🎉 Compte activé !
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px; color: #333333; line-height: 1.8;">
                                <p style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #2c3e50;">
                                    Bonjour {user.name},
                                </p>
                                <p style="margin: 0 0 20px; font-size: 16px; color: #555555;">
                                    Excellente nouvelle ! Votre compte sur la plateforme <strong style="color: #4CAF50;">Vente PI</strong> a été activé par l'administrateur.
                                </p>
                                <p style="margin: 0 0 32px; font-size: 16px; color: #555555;">
                                    Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme et commencer à travailler.
                                </p>
                                <div style="text-align: center; margin: 32px 0;">
                                    <a href="{frontend_url}"
                                       style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">
                                        Accéder à la plateforme →
                                    </a>
                                </div>
                                <div style="margin-top: 32px; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #4CAF50; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 14px; color: #666666;">
                                        💡 <strong>Astuce :</strong> Pensez à ajouter cette adresse email à vos contacts pour ne manquer aucune notification importante.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center;">
                                <p style="margin: 0 0 12px; font-size: 14px; color: #666666;">
                                    Cordialement,
                                </p>
                                <p style="margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #333333;">
                                    L'équipe Vente PI
                                </p>
                                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                                <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.6;">
                                    Cet email a été envoyé automatiquement depuis la plateforme Vente PI.<br>
                                    Merci de ne pas répondre directement à cet email.
                                </p>
                                <p style="margin: 16px 0 0; font-size: 11px; color: #aaaaaa;">
                                    © 2025 Vente PI - Tous droits réservés
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    current_app.logger.info(f"[EMAIL] Préparation email pour {user.name} ({user.email})")
    current_app.logger.info(f"[EMAIL] URL frontend utilisée : {frontend_url}")

    Thread(
        target=send_async_email_brevo,
        args=(current_app._get_current_object(), user.email, subject, html_content),
        daemon=True
    ).start()