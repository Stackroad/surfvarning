import smtplib
import sys

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def degrees_to_cardinal(degrees):
    dict = {}
    dict[45] = 'northeast'
    dict[90] = 'east'
    dict[135] = 'southeast'
    dict[180] = 'south'
    dict[225] = 'southwest'
    dict[270] = 'west'
    dict[315] = 'northwest'
    dict[360] = 'north'
    return dict[degrees]

def sendFunc(spot, wind, wind_direction, clients, password, user):
    sent_from = user
    to = client

    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "SURFVARNING in " + spot + "! 🏄‍"
    msg['From'] = sent_from
    msg['To'] = user
    print(to)
    print("IN MAIL FUNC")
    print("client,", client)

    # Map wind direction from angle in degrees to cardinal direction
    wind_direction = degrees_to_cardinal(wind_direction)

    # Create the body of the message (a plain-text and an HTML version).
    html = """\
    <html>
      <head></head>
      <body>
        <p>Looks like it is going to be surf in """ + spot + """ tomorrow!<br>
           The wind is going to be """ + str(wind) + """ m/s and is going to come from """ + wind_direction + """. <br>
           <br>
           <br>
           Want to unsubscribe to this message? :'( <br>
           Remember that this is only a beta version! Still want to unsubscribe, follow the link:
           <a href="http://perwelander.com/managesubscription?email=""" + client + """&spot=""" + spot + """ ">link</a>
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
        mail.sendmail(sent_from, client, msg.as_string())
        mail.quit()
        print('Email sent!')
    except:
        print('Something went wrong...')
    sys.stdout.flush()
