import web
import json
import time
import os
import base64
import sqlite3
import threading
from nmon_analyser.analyser import Local, Remote,sortBymtime

render = web.template.render('templates/')

urls = (
    '/chart','chart',
    '/data', 'data',
    '/local', 'local',
    '/remote', 'remote',
    '/(js|css|images|plugins|src)/(.*)', 'static'
)

dbpath = './data'


class static:
    def GET(self, media, file):
        try:
            with open(media + '/' + file, 'r', encoding='utf-8') as f:
                return f.read()
        except:
            print("error")
            return '404'

class chart:
    def GET(self):
        res = {}
        #dirList = os.listdir(dbpath)
        dirList = sortBymtime(dbpath)
        dirList.reverse()
        for i in dirList:
            dbfile = []
            fileList = os.listdir(os.path.join(dbpath, i))
            #fileList = sortBymtime(os.path.join(dbpath, i))
            fileList.reverse()
            for j in fileList:
                if j.split('.')[-1] == 'db':
                    dbfile.append(j.split('.')[0])

            res.update({i: dbfile})
        
        
        recent = dirList[0] + ':' + sortBymtime(os.path.join(dbpath, dirList[0]))[-1].split('.')[0]

        http_host = web.ctx.env.get('HTTP_HOST')
        http_host = http_host.split(":")[0]
        if http_host == '127.0.0.1':
            c = True
        else:
            c = False
            
        return render.index(c,recent,res)


class data:
    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")

        hostname = web.input()['hostname']
        co_date = web.input()['co_date']

       # print(hostname,co_date)

        conn = sqlite3.connect('%s/%s/%s.db' % (dbpath, hostname, co_date))
        cursor = conn.cursor()

        try:
            idata = cursor.execute('SELECT * FROM dashboard;')
        except:
            print("SELECT ERR")

        rdata = []
        for i in idata:
            rdata.append({"cpu": i[4]+i[5], "mem_sys": i[12],"mem_free": i[13],"mem_user": i[15],
                          "io": i[16], "time": i[3].split(' ')[1]})

        cursor.close()
        conn.close()

        return json.dumps(rdata)


class local:
    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")
        try:
            src = web.input()['src']
            srclist = src.split('|')
            result = Local(srclist)
        except:
            result = 'fail'
        return result


class remote:
    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")
        key = web.input()['key']
        tmp = base64.b64decode(key).decode()
        msg = []
        for item in tmp.split(':'):
            msg.append(base64.b64decode(item).decode())
        result = Remote(msg)
        return result


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
