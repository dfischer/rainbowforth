import re
import os
import sys
import StringIO
import pngcanvas
import random
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app


class Word(db.Model):
  icon = db.StringProperty()
  description = db.StringProperty()
  definition = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  author = db.StringProperty()
  total_users = db.IntegerProperty()
  outbound_users = db.IntegerProperty()


class ReadWord(webapp.RequestHandler):
  def get(self):
    id = self.request.path[6:]
    w = Word.get(id)
    if w:
      path = os.path.join(os.path.dirname(__file__), 'html/read.html')
      self.response.out.write(template.render(path, {
          'id': id,
          'description': w.description,
          #'definition': w.definition,
          'definition': [id, id, id, id, id],
          'created': str(w.created),
          'author': w.author,
          'total_users': w.total_users,
          'outbound_users': w.outbound_users,
      }))
    else:
      path = os.path.join(os.path.dirname(__file__), 'html/read_notfound.html')
      self.response.out.write(template.render(path, {}))


class ReadIcon(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'image/png'
    c = pngcanvas.PNGCanvas(64, 64)
    id = self.request.path[6:]
    try:
      w = Word.get(id)
    except:
      w = None
    if w:
      data = w.icon
      for y in range(0, 32):
        for x in range(0, 32):
          z = x + y * 32
          if z < len(data) and int(data[z]):
            c.color = [0x00, 0x00, 0x00, 0xff]
          else:
            c.color = [0xff, 0xff, 0xff, 0xff]
          c.rectangle(x*2, y*2, x*2+1, y*2+1)
    else:
      c.verticalGradient(0, 0, c.width-1, c.height-1,
                        [0xff,0,0,0xff],
                        [0x20,0,0xff,0x80])
    self.response.out.write(c.dump())


class WriteWord(webapp.RequestHandler):
  def post(self):
    w = Word()
    w.icon = self.request.get('icon')
    w.description = self.request.get('description')
    w.definition = self.request.get('definition')
    w.author = self.request.remote_addr
    w.total_users = 0
    w.outbound_users = 1
    w.put()
    self.redirect('/read/%s' % str(w.key()))


class RawEdit(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'html/raw.html')
    self.response.out.write(template.render(path, {}))


class MainPage(webapp.RequestHandler):
  def get(self):
    agent = self.request.headers.get('User-Agent', '')
    if agent.find('MSIE')>=0 and agent.find('chromeframe') < 0:
      path = os.path.join(os.path.dirname(__file__), 'html/chrome_frame.html')
    else:
      path = os.path.join(os.path.dirname(__file__), 'html/editor.html')
    self.response.out.write(template.render(path, {}))


def main():
  application = webapp.WSGIApplication([
      ('/[0-9]*', MainPage),
      ('/read/.*', ReadWord),
      ('/icon/.*', ReadIcon),
      ('/write', WriteWord),
      ('/raw', RawEdit),
  ], debug=True)
  run_wsgi_app(application)


if __name__ == "__main__":
  main()
