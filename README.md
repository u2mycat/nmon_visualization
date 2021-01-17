# AIX nmon性能数据可视化

用于提取nmon文件中记录的性能数据，通过chart在浏览器中展示，适用于系统运维人员。目前仅对AIX系统nmon文件进行测试，Linux下nmon文件未测试。

![avatar](https://github.com/u2mycat/nmon_visualization/blob/master/main.png)

工具后端使用python编写，主要用到 [web.py](https://webpy.org/) web框架，前端使用html，调用 [echart.js](https://echarts.apache.org/zh/index.html) \\ [base64.js](https://github.com/dankogai/js-base64)

### 环境
    
    python 3.x

### 第三方依赖包

    # pip install web.py
    # pip install paramiko

### 使用说明

> 运行工具

    # 默认使用 0.0.0.0:8080 地址
    # python run.py

    # 指定地址和端口
    # python run.py 127.0.0.1:80

> 浏览器中打开地址 127.0.0.1:80/chart

开发过程仅使用chrome调试，考虑兼容性推荐使用chrome打开

通过修改run.py中url配置来改变地址映射关系

    urls = (
    '/chart', 'chart',
    '/data', 'data',
    '/local', 'local',
    '/remote', 'remote',
    '/(js|css|images|plugins|src)/(.*)', 'static'
    )

---

## nmon数据提取方式说明
> 本地提取
    
    1.将文件路径粘贴到相应输入框
    2.点击分析
    3.等待数十秒页面自动刷新后分析对象将在页面左侧菜单栏展示
    4.点击相应日期文件展示相应chart折线图

> 远程提取

    1.输入主机ip，nmon文件路径，用户名和口令
    2.点击获取
    3.等待数十秒页面自动刷新后分析对象将在页面左侧菜单栏展示
    4.点击相应日期文件展示相应chart折线图

> 注意事项

    1.nmon文件数量和数据量决定分析时长，ssh登录速度决定分析时长
    2.请确保路径正确
    3.请确保登录信息正确，未作ssh登录结果验证，信息错误可能报错或程序崩溃
    4.提取目录及使用正则通配符请量力而为，文件过多易造成程序崩溃或运行缓慢
---

## 路径说明

> 本地nmon
    
    例,   
    Linux:
    /tmp/nmon/
    /tmp/hostname-190101-0000.nmon
    /tmp/hostname-190101-0000.nmon|/tmp/hostname-190102-0000.nmon

    Windows:
    D:\nmon\hostname-190101-0000.nmon
    D:\nmon\hostname-190101-0000.nmon|D:\nmon\hostname-190102-0000.nmon

> 远程nmon

    例,
    /tmp/nmon/*
    /tmp/hostname-190101-0000.nmon
    /tmp/hostname-1901*-0000.nmon
    /tmp/hostname-19010[1-5]*-0000.nmon

`"ls -l %s|grep -E '.nmon$'|awk '{print $9}'" % path`

远程获取实际执行ls命令获取nmon文件名，路径正则通配凡是符合以上代码格式理论都可以，请确保通配符使用正确，并建议加上.nmon结尾

---

## nmon文件说明

> 文件格式

请确保nmon文件命名格式为如下（nmon默认输出格式），

    [hostname]_[date]_[time].nmon

    例,
    localhost_200423_0000.nmon


文件名将用于生成数据库存放目录名及数据库名


```python
file = 'localhost_200423_0000.nmon'
hostname = file.split('_')[0] # localhost
date = file.split('_')[1] # 200423
```
    ...
    ├─data
    │  ├─localhost
    │  │      200423.db
    ...

为了获得完整系统性能数据建议使用crontab定时任务采集nmon全天数据
，【数据记录说明】中将会说明原因

    0 0 * * * nmon -f -N -m /tmp/nmon -s 120 -c 720


---

## 数据记录说明

该工具使用sqlite3进行数据存储，具体数据文件存放在项目目录下的data中，结构为:

    ...
    ├─data
    │  ├─ip_address_1
    │  │      200416.db
    │  │
    │  └─ip_address_2
    │          200110.db
    │          200111.db
    │          200112.db
    ...


推荐使用全天采集的nmon文件原因在于，同一天采集的nmon文件在分析时使用文件名中日期段生成数据库文件名，未对数据库具体记录做判断，因考虑数据重复提交的可能，对于发现同名(日期)数据文件存在即跳过相应的nmon文件不做分析。
    如需实现分析分时采集的nmon并存放于同一数据库文件中，可通过修改`analyser.py`中的`Analyser()`函数
    
    ...
    ├─nmon_analyser
    │  │  analyser.py
    │  │  __init__.py
    │  │
    ...

```python
def Analyser(hostname, co_date, lines):
    path = './data/%s' % hostname
    if not os.path.exists(path):
        os.makedirs(path)
    # 注释 elif及以下内容实现分析分时nmon文件
    elif os.path.exists('%s/%s.db' % (path, co_date)):
        return 'exists'
    ...
```

数据主要包含CPU、内存、IO三大类数据，相关字段
    
    CPU_USER,CPU_SYS,CPU_WAIT,CPU_IDLE,CPU_BUSY,CPU_PHYSICALCPUS,MEM_PROCESS,MEM_FSCACHE,MEM_SYSTEM,MEM_FREE,MEM_PINNED,MEM_USER,IO
    
前端chart默认展示data目录下第一个文件夹中的第一个数据库文件，建议运行工具前，确认data中至少包含一个目录及一个可用数据库文件



