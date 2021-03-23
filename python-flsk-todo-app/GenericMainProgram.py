# -*- coding: utf-8 -*-
"""
Created on Wed Dec 25 15:17:09 2019

@author: F126191299
"""
import pymssql
import pandas as pd
import config
import smtplib, ssl
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler


class GenericMainProgram:
    
    c_mainDir =''
    #c_cName='s'  
    c_dbServer=''
    
    def __init__(self):
        self.c_mainDir = "D:/Python01/"
        #self.c_cName = in_cName
        self.c_dbServer="3-123"
        log_filename =datetime.now().strftime(self.c_mainDir+"log/"+self.c_dbServer+"_"+__class__.__name__ +"_%Y-%m-%d.log")
        logging.basicConfig(filename=log_filename, level=logging.DEBUG,
                        format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S',
                        )
        logging.info(self.c_mainDir)
        #logging.info(self.c_cName)
        logging.info(self.c_dbServer)
        
    def getConfigHash_JAVA(filename):
        config_dict = dict()
        fp = open(filename, "r")
        line = fp.readline()
        while len(line.strip()) > 1:
            if "#" != line[:1]:
                print(line)
                idx = line.index("=")
                config_dict[line[:idx].strip()] = line[idx + 1:].strip()
                line = fp.readline()
        return config_dict

    def getDBConnection_JAVA(resource, dbType, dbName):
        server1 = resource[dbType + "_DB_server"]
        user1 = resource[dbType + "_DB_user"]
        password1 = resource[dbType + "_DB_password"]
        conn = pymssql.connect(
            server=server1,
            user=user1,
            password=password1,
            database=dbName,
            as_dict=True
        )
        return conn

    def getDBConnection(dbType, dbName, timOut):
        intimOut = 15
        if timOut > intimOut:
            intimOut = timOut
        dictx = config.DB_conn
        conn = pymssql.connect(
            server=dictx[dbType + '_server'],
            #user=dictx[dbType+'_user'],
            #password=dictx[dbType+'_password'],
            database=dbName,
            timeout=intimOut,
            as_dict=True,
            charset='utf8'
        )
        conn.autocommit(True)
        return conn

    def executeSQLWithConn(conn, sql):
        cursor = conn.cursor()
        cursor.execute(sql)

    def executeSQLWithConnInOut(conn, sql):
        results = dict()
        cursor = conn.cursor()
        cursor.execute(sql)
        #20200513 by john 改成回傳多筆
        #results = cursor.fetchone()
        results = cursor.fetchall()
        return results

    def executeSQL(sql, dbType, dbName, timOut):
        conn = GenericMainProgram.getDBConnection(dbType, dbName, timOut)
        try:
            cursor = conn.cursor()
            cursor.execute(sql)
        finally:
            conn.close()
	
    def executeManySQL(sql, dbType, dbName, timOut,p_list=[]):
        conn = GenericMainProgram.getDBConnection(dbType, dbName, timOut)
        try:
            cursor = conn.cursor()
            cursor.executemany(sql,p_list)
        finally:
            conn.close()

    def executeSQLInOut(sql, dbType, dbName, timOut):
        results = dict()
        conn = GenericMainProgram.getDBConnection(dbType, dbName, timOut)
        try:
            cursor = conn.cursor()
            cursor.execute(sql)
            #20200513 by john 改成回傳多筆
            #results = cursor.fetchone()
            results = cursor.fetchall()
        finally:
            conn.close()
        return results
       
    def sendMail(title, msg,To=['kengyu.c@cathaysec.com.tw','kengyu.c@cathaysec.com.tw'],CC=[],BCC=[],files=None):
        html_string = """
            <html>
				<head><title>%s</title></head>
				<link rel="stylesheet" type="text/css" href="df_style.css"/>
				<body>
				<b>%s</b>
				</body>
            </html>
            """ % (title, msg)
        #html_string.format(table=msg.to_html(classes='mystyle'))
        mime =MIMEMultipart()
       # mime = MIMEText(html, "html", "utf-8")
        mime["Subject"] = title
        mime["From"] = "m-datacenter@cathaysec.com.tw"
        mime["To"] = ",".join(To)
        if CC:
            mime["Cc"] = ",".join(CC)
        if BCC:
            mime["Bcc"] = ",".join(BCC)
        #msg = mime.as_string()
        mime.attach(MIMEText(html_string, "html", "utf-8"))
        #attachment
        for f in files or []:
            with open(f, "rb") as fil:
                part = MIMEApplication(
                    fil.read(),
                    Name=basename(f)
                )
                part['Content-Disposition'] = 'attachment; filename="%s"' % basename(f)
                mime.attach(part)
        smtp = smtplib.SMTP("cathaymail.linyuan.com.tw", 587)
        smtp.ehlo()
        smtp.starttls()
        smtp.login("m-datacenter@cathaysec.com.tw", "Cathay123")
        # from_addr="m-datacenter@cathaysec.com.tw"
        # to_addr=["kengyu.c@cathaysec.com.tw"]
        status = smtp.sendmail(mime["From"], To + CC + BCC, mime.as_string())
        if status == {}:
            print("郵件傳送成功!")
        else:
            print("郵件傳送失敗!")
        smtp.quit()
        
    def twDateToDate(in_twDate):
        y, m, d = in_twDate.split('/')
        return str(int(y)+1911) + '/' + m  + '/' + d
    
    def checkIsTradeDay(in_day=datetime.today().strftime('%Y%m%d')):
        result =False
        #sql="""  select top 1 D_TRADE_DATE  from sql3112.R6DB.[dbo].[TRADE] with(nolock) where D_TRADE_DATE= convert(varchar, getdate(), 112)   """
        sql="""  select top 1 D_TRADE_DATE  from sql3112.R6DB.[dbo].[TRADE] with(nolock) where D_TRADE_DATE= '%s'   """%(in_day)
        d =GenericMainProgram.executeSQLInOut(sql,'3-123', 'OUTBOUND', 15)
        if bool(d):
            result =True
        return result
    
    def getProdlsit():
        dictx = config.DB_conn
        realKeylist=[]
        keylist=dictx.keys()
        for key in keylist:
            x= key.find("_isprod")
            if(x>0):
                if( 'Y'==dictx[key]):
                    realKeylist.append(key[0:x])
        return realKeylist
        
    def run():
        #config_dict1 =GenericMainProgram.getConfigHash_JAVA("D:\D\DataCenter\DBconfig.config")
        #conn1 = GenericMainProgram.getDBConnection_JAVA(config_dict1,'123','DB_MANAGE')
        #conn1 =GenericMainProgram.getDBConnection('125','DB_MANAGE',300)
        #sql ='select top 20 * from DB_MANAGE.dbo.執行序列 '
        #datas = pd.read_sql(sql, conn1)
        if GenericMainProgram.checkIsTradeDay():
            print('true')
        else:
            print('false')
        #GenericMainProgram.sendMail('SECSVR3-125 Python RunProcess_error','cyndi',['kengyu.c@cathaysec.com.tw'])

#runPrgram
if __name__ == "__main__":
    #GenericMainProgram.run()
    GenericMainProgram.run()

# sql_ssis="""  EXEC DB_MANAGE.dbo.SP_RUNSSIS_CALL_BY_PYTHON \
# '%s', %s ,'%s' ,'%s', '%s', '%s' ,'%s' ,'%s' ,'%s' ,'%s', '%s', %s ,%s  \
# """%('2019-12-27 12:00:00',2,'3','4','5','6','7','8','9','10','11',12)
# print(sql_ssis)
# cynid=GenericMainProgram.executeSQLInOut(sql_ssis,'125','DB_MANAGE',300)
# print(type(cynid))
# print(x2)
# for i in cynid:
# print('begin')
# print( i, cynid[i])
# GenericMainProgram.sendMail('SECSVR3-125-數據處理排程作業錯誤通知','用途說明: 1:儀表報表-國壽數位體驗問卷即時追蹤_15分鐘')
