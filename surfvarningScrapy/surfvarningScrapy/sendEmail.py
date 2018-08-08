import smtplib
import sys

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def sendFunc(spot, wind, wind_direction, clients, password, user):
    sent_from = user
    to = clients

    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "SURFVARNING in " + spot + "! 🏄‍"
    msg['From'] = sent_from
    msg['To'] = user
    print(to)

    # Create the body of the message (a plain-text and an HTML version).
    html = """\
    <html>
      <head></head>
      <body>
        <p>Looks like it is going to be surf in """ + spot + """ tomorrow!<br>
           The wind is going to be """ + str(wind) + """ m/s <br>
           <br>
           <br>
           <br>
           Want to unsubscribe to this message :( follow the link:  <a href="http://127.0.0.1/managesubscription">link</a>
        </p>
      </body>
    </html>
    """
    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(html, 'html')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    # Send the message via local SMTP server.
    mail = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    try:
        mail.login(user, password)
        mail.sendmail(sent_from, [user] + clients, msg.as_string())
        mail.quit()
        print('Email sent!')
    except:
        print('Something went wrong...')
    sys.stdout.flush()
