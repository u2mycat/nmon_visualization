import time
import re
import sqlite3
import os
import paramiko
import threading

MONTH_DICT = {'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
              'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'}


def sum_str(data):
    value = 0.0
    for i in data:
        value += float(i)
    return round(value, 1)


def Analyser(hostname, co_date, lines):
    path = './data/%s' % hostname
    if not os.path.exists(path):
        os.makedirs(path)
    elif os.path.exists('%s/%s.db' % (path, co_date)):
        os.remove('%s/%s.db' % (path, co_date))
        print('[removed] %s/%s.db' % (path, co_date))
        
        #return 'exists'

    conn = sqlite3.connect('%s/%s.db' % (path, co_date))
    cursor = conn.cursor()
    print('连接:%s/%s.db' % (path, co_date))

    newlines = []
    ts = []
    tmp = {}

    for line in lines:
        if re.match(r'^ZZZZ,T.*', line) or re.match(r'^MEMNEW,T.*', line) or re.match(r'^CPU_ALL,T.*', line) or re.match(r'^DISKXFER,T.*', line):
            newlines.append(line)
            if re.match(r'^ZZZZ,T.*', line):
                ts.append(line.rstrip('\n').split(',')[1:])

    for t in ts:
        datetime = "%s-%s-%s %s" % (t[2].split('-')[2],
                                    MONTH_DICT[t[2].split('-')[1]], t[2].split('-')[0], t[1])
        tmp.update({'datetime': datetime})
        for line in newlines:
            if re.match(r'MEMNEW,%s.*' % t[0], line):
                memdata = line.rstrip('\n').split(',')[2:]
                tmp.update({'mem_Process': memdata[0], 'mem_FScache': memdata[1], 'mem_System': memdata[2],
                            'mem_Free': memdata[3], 'mem_Pinned': memdata[4], 'mem_User': memdata[5]})
            elif re.match(r'CPU_ALL,%s.*' % t[0], line):
                cpudata = line.rstrip('\n').split(',')[2:]
                tmp.update({'cpu_User': cpudata[0], 'cpu_Sys': cpudata[1], 'cpu_Wait': cpudata[2],
                            'cpu_Idle': cpudata[3], 'cpu_Busy': cpudata[4], 'cpu_PhysicalCPUs': cpudata[5]})
            elif re.match(r'DISKXFER,%s.*' % t[0], line):
                iodata = line.rstrip('\n').split(',')[2:]
                tmp.update({'io': sum_str(iodata)})

        insert = '''INSERT INTO DASHBOARD (HOSTNAME,CO_NUM,DATETIME,CPU_USER,CPU_SYS,CPU_WAIT,CPU_IDLE,CPU_BUSY,CPU_PHYSICALCPUS,MEM_PROCESS,MEM_FSCACHE,MEM_SYSTEM,MEM_FREE,MEM_PINNED,MEM_USER,IO) 
            VALUES ('%s','%s','%s',%.1f,%.1f,%.1f,%.1f,%.1f,%d,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f)''' % (hostname, t[0], tmp['datetime'], float(tmp['cpu_User']), float(tmp['cpu_Sys']), float(tmp['cpu_Wait']), float(tmp['cpu_Idle']), float(tmp['cpu_Busy']), int(tmp['cpu_PhysicalCPUs']), float(tmp['mem_Process']), float(tmp['mem_FScache']), float(tmp['mem_System']), float(tmp['mem_Free']), float(tmp['mem_Pinned']), float(tmp['mem_User']), tmp['io'])

        try:
            cursor.execute(insert)
        except sqlite3.OperationalError:
            cursor.execute('''CREATE TABLE DASHBOARD (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,HOSTNAME CHAR(50),CO_NUM CHAR(6),DATETIME CHAR(19),CPU_USER REAL,CPU_SYS REAL,CPU_WAIT REAL,CPU_IDLE REAL,CPU_BUSY REAL,CPU_PHYSICALCPUS INT,MEM_PROCESS REAL,MEM_FSCACHE REAL,MEM_SYSTEM REAL,MEM_FREE REAL,MEM_PINNED REAL,MEM_USER REAL,IO REAL);''')
            cursor.execute(insert)

    conn.commit()
    conn.close()
    print('关闭:%s/%s.db' % (path, co_date))
    #return 'ok'


def Remote(msg):
    path = msg[2]
    print(path)
    if re.match(r'.*\;.*|.*\&.*|.*\|.*',path) or re.match(r'.*shutdown.*|.*reboot.*|.*rm\ .*|.*rmdev\ .*|.*>.*|.*mv.*|.*mkfs.*|.*dd.*|.*\\x.*',path) :
        print('非法输入')
        return 'in_err'
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=msg[0], port=msg[1],username=msg[3], password=msg[4])
        print('ssh连接')
    except:
        print('ssh连接失败，请核查登录信息')
        return('ssh_err')

    try:
        stdin, stdout, stderr = ssh.exec_command("ls -l %s|grep -E '.nmon$'|awk '{print $NF}'" % path)
        co_date = stdout.read()
        print(co_date)
    except:
        print("命令执行错误")
        return('cmd_err')

    try:
        tobj = []
        for i in str(co_date, encoding='utf-8').rstrip('\n').split('\n'):

            try:
                stdin, stdout, stderr = ssh.exec_command(
                    "cat %s | grep -E 'ZZZZ|MEMNEW|CPU_ALL|DISKXFER'" % i)
                lines = stdout.read()
            except:
                print('nmon文件打开错误')
                return 'op_err'

            lines = str(lines, encoding='utf-8').rstrip('\n').split('\n')
            # print(i.split('/')[-1].split('_')[0])

            try:
                #t = threading.Thread(target=Analyser, args=(i.split('/')[-1].split('_')[0], i.split('_')[1], lines))
                t = threading.Thread(target=Analyser, args=(msg[0], i.split('_')[1], lines))
                t.start()
                tobj.append(t)
            except:
                print('分析错误')
                return 'an_err'

        ssh.close()

        for t in tobj:
            t.join()

        return 'ok'
    except:
        return 'fail'

    


def Local(srclist):
    tmp = []
    for item in srclist:
        if os.path.isdir(item):
            for ifile in os.listdir(item):
                if ifile.split('.')[-1] == 'nmon':
                    tmp.append(os.path.join(item, ifile))
        elif os.path.isfile(item):
            tmp.append(item)

    tobj = []
    for filepath in tmp:
        print("分析:", filepath)
        if os.name == 'nt':
            ufile = filepath.split('\\')[-1]
        elif os.name == 'posix':
            ufile = filepath.split('/')[-1]

        try:
            hostname = ufile.split('_')[0]
            co_date = ufile.split('_')[1]
        except:
            return 'path error'

        path = './data/%s' % hostname

        if not os.path.exists(path):
            os.makedirs(path)
        elif os.path.exists('%s/%s.db' % (path, co_date)):
            return 'exists'

        with open(filepath, 'r') as f:
            lines = f.readlines()

        t = threading.Thread(target=Analyser, args=(hostname, co_date, lines))
        t.start()
        tobj.append(t)

    for t in tobj:
        t.join()

    return 'ok'


def sortBymtime(file_path):
    files = os.listdir(file_path)
    if not files:
        return
    else:
        files = sorted(files,key=lambda x: os.path.getmtime(os.path.join(file_path,x)))
        return files


if __name__ == "__main__":
    pass
